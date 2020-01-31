package athenarc.imsi.sdl.web.rest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import javax.validation.Valid;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import athenarc.imsi.sdl.service.RankingService;
import athenarc.imsi.sdl.service.util.FileUtil;
import athenarc.imsi.sdl.web.rest.vm.QueryConfigVM;

/**
 * RankingResource controller
 */
@RestController
@RequestMapping("/api/ranking")
public class RankingResource {

    private final Logger log = LoggerFactory.getLogger(RankingResource.class);
    
    @Autowired
    private final RankingService rankingService = new RankingService();
    
    /**
    * POST submit
    */
    @PostMapping("/submit")
    public Document submit(@Valid @RequestBody QueryConfigVM config) {
        
        String id = UUID.randomUUID().toString();
        log.debug("Ranking task submitted with id: " + id);

        try {

            // run async method from service
            rankingService.submit(id, config);        

        } catch (java.io.IOException | InterruptedException e) {
            throw new RuntimeException("Error running ranking task: " + id);
        }
		return new Document("id", id);
    }

    /**
    * GET status
    */
    @GetMapping("/get")
    public Document status(String id,  Integer page) {
        log.debug("ranking/status : {}", id, page);

        String logfile = FileUtil.getLogfile("ranking", id);
        try {
            String lastLine = FileUtil.getLastLine(logfile);
            int index = lastLine.indexOf("Exit Code");
            Document response = new Document();
            if (index >= 0) {
                int exitCode = Integer.parseInt(lastLine.split("\t")[1]);

                // error occurred in ranking script
                if (exitCode != 0) {
                    throw new RuntimeException("Error in ranking task: " + id);
                }

                String rankingFile = FileUtil.getRankingFIle("ranking", id);
                
                try {
                    Document meta = new Document();
                    List<Document> docs = rankingService.getResults(rankingFile, page, meta);

                    response.append("id", id)
                        .append("progress", 100)
                        .append("exitCode", exitCode)
                        .append("_meta", meta)
                        .append("docs", docs);

                } catch (IOException e) {
                    throw new RuntimeException("Error results from file");
                }
            } else {

                String[] tokens = lastLine.split("\t");
                
                response.append("id", id)
                    .append("stage", tokens[0])
                    .append("step", tokens[2])
                    .append("progress", rankingService.getProgress(tokens[0], Integer.parseInt(tokens[1])));
            }

            return response;
        } catch (IOException e) {
            throw new RuntimeException("Error reading status from logfile");
        }
    }
}
