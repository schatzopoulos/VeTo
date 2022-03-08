package athenarc.imsi.sdl.web.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.validation.Valid;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import athenarc.imsi.sdl.service.AnalysisService;
import athenarc.imsi.sdl.service.util.FileUtil;
import athenarc.imsi.sdl.web.rest.vm.QueryConfigVM;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Example;
import io.swagger.annotations.ExampleProperty;

/**
 * RankingResource controller
 */
@CrossOrigin
@RestController
@RequestMapping("/api/analysis")
public class AnalysisResource {

    private final Logger log = LoggerFactory.getLogger(AnalysisResource.class);

    @Autowired
    private final AnalysisService analysisService = new AnalysisService();

    /**
     * POST submit
     */
    @ApiOperation(value = "Used to submit a new analysis")
    @ApiResponses(value =
        {
            @ApiResponse(code = 200, message = "The analysis was successfully submitted"),
            @ApiResponse(code = 400, message = "Bad request")
        }
    )
    @PostMapping(value = "/submit", produces = "application/json;charset=UTF-8")
    public Document submit(@Valid @RequestBody QueryConfigVM config) {
        String id = UUID.randomUUID().toString();

        try {

            // run async method from service
            analysisService.submit(
                id,
                config.getExpertSet(),
                config.getSimThreshold(),
                config.getSimMinValues(),
                config.getSimsPerExpert(), 
                config.getApvWeight(),
                config.getAptWeight(), 
                config.getOutputSize()
            );

        } catch (java.io.IOException | InterruptedException e) {
            throw new RuntimeException("Error running ranking task: " + id);
        }
        return new Document("id", id);
    }

    @ApiOperation(value = "Retrieves the status of a submitted analysis")
    @ApiResponses(value =
        {
            @ApiResponse(code = 200, message = "The analysis was found and its status was successfully retrieved", examples = @Example(@ExampleProperty(value = "da", mediaType = "dadwad"))),
            @ApiResponse(code = 400, message = "Bad request")
        }
    )
    @GetMapping(value = "/status", produces = "application/json;charset=UTF-8")
    public Document status(
        @ApiParam(value = "The ID that was assigned on the analysis in question, during submission", required = true) @RequestParam  String id) {
        log.debug("analysis/status : {}", id);

        Document response = new Document();
        response.append("id", id);

        try {
            // parse log file
            String logfile = FileUtil.getLogfile(id);
            Document logInfo = FileUtil.parseLogfile(logfile);
            String lastLine = (String) logInfo.get("lastLine");

            String[] tokens = lastLine.split("\t");

            if (tokens[1].equals("Exit Code")) {
                if (!tokens[0].equals("0")) {
                    throw new RuntimeException("Error in analysis task: " + id);
                } 
                else {
                    response.append("progress", 100)
                    .append("description", "Finished expert set expansion");
                }
            } else if (tokens.length == 2) {
                response.append("progress", analysisService.getProgress(Integer.parseInt(tokens[0])))
                    .append("description", tokens[1]);

            // in case logfile is still empty
            } else {
                response.append("progress", 0).append("description", "Initializing");
            }
            return response;
        } catch (IOException e) {
            throw new RuntimeException("Error reading status from logfile");
        }
    }

    /**
     * GET status
     */
    @ApiOperation(value = "Retrieves the results for a given analysis")
    @ApiResponses(value =
        {
            @ApiResponse(code = 200, message = "The analysis was found and the results were successfully retrieved"),
            @ApiResponse(code = 400, message = "Bad request")
        }
    )
    @GetMapping(value = "/get", produces = "application/json;charset=UTF-8")
    public Document get(
        @ApiParam(value = "The ID that was assigned on the analysis in question, during submission", required = true) @RequestParam String id,
        @ApiParam(value = "A value N greater or equal to 1 that is used to retrieve the [(N-1)*50,N*50) results") @RequestParam(required = false) Integer page) {
        log.debug("analysis/get : {}", id, page);

        String logfile = FileUtil.getLogfile(id);
        Document response = new Document();

        try {
            Document logInfo = FileUtil.parseLogfile(logfile);
            String lastLine = (String) logInfo.get("lastLine");

            // throw error if analaysis was aborted with an error code
            int index = lastLine.indexOf("Exit Code");
            if (index >= 0) {
                int exitCode = Integer.parseInt(lastLine.split("\t")[0]);

                // error occurred in ranking script
                if (exitCode != 0) {
                    throw new RuntimeException("Error in analysis task: " + id);
                }
            }

            String resultsFile = FileUtil.getOutputFile(id);

            Document meta = new Document();
            List<Document> docs = analysisService.getResults(resultsFile, page, meta);

            response.append("id", id)
                .append("_meta", meta)
                .append("docs", docs);



        } catch (IOException e) {
            e.printStackTrace();
            // throw new RuntimeException("Error reading status from logfile");
        }
        return response;

    }

    /**
     * GET analysis exists
     */
    @ApiOperation(value = "Checks whether an analysis with the given ID exists")
    @ApiResponses(value =
        {
            @ApiResponse(code = 200, message = "The analysis was found and the corresponding analysis types are returned"),
            @ApiResponse(code = 400, message = "Bad request")
        }
    )
    @GetMapping(value = "/exists", produces = "application/json;charset=UTF-8")
    public ResponseEntity<Document> exists(
        @ApiParam(value = "The ID that was assigned to the analysis in question, during submission", required = true) @RequestParam String id) {
        log.debug("analysis/exists : {}", id);

        Boolean exists = FileUtil.dirExists(id);
        try {
            // parse config file
            String conf = FileUtil.readJsonFile(FileUtil.getConfFile(id));
            Document config = Document.parse(conf);
            ArrayList<String> analyses = (ArrayList<String>) config.get("analyses");
            Document content = new Document().append("id", id).append("exists", exists).append("analysis", analyses);

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/json;charset=UTF-8"))
                .body(content);

        } catch (IOException e) {
            throw new RuntimeException("Error reading status from logfile");
        }

    }

}
