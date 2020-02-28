package athenarc.imsi.sdl.web.rest;

import java.io.IOException;
import java.util.List;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import athenarc.imsi.sdl.service.DatasetsService;
import athenarc.imsi.sdl.service.util.FileUtil;
/**
 * RankingResource controller
 */
@RestController
@RequestMapping("/api/datasets")
public class DatasetsResource {

    private final Logger log = LoggerFactory.getLogger(DatasetsResource.class);
    
    @Autowired
    private final DatasetsService datasetsService = new DatasetsService();
    
    /**
    * POST submit
    */
    @PostMapping("/upload")
    public Document upload(@RequestParam("file") MultipartFile file) {
            String filename = file.getOriginalFilename();

            if (file.isEmpty()) {
                throw new RuntimeException("Error uploading " + filename);
            }

            try {
                String zipFile = datasetsService.upload(filename, file.getBytes());
                if (FileUtil.unzip(zipFile) != 0){
                    throw new RuntimeException("Error unzipping " + zipFile);
                }

                if (!FileUtil.remove(zipFile)) {
                    throw new RuntimeException("Error removing zip  " + zipFile);
                }

            } catch (IOException | InterruptedException e) {
                throw new RuntimeException("Error uploading " + filename);
            }

            return new Document("status", "success");
    }

    /**
    * GET status
    */
    @GetMapping("/schemas")
    public Document getSchemas() {
        Document response;
        try {
            response = datasetsService.getSchemas();
        } catch (IOException e) {
            throw new RuntimeException("Error reading schema for datasets");
        }

        return response;
    }

    /**
    * GET status
    */
    @GetMapping("/autocomplete")
    public List<Document> autocomplete(@RequestParam(value = "folder") String folder, 
        @RequestParam(value = "entity") String entity, 
        @RequestParam(value = "field") String field,
        @RequestParam(value = "term") String term) {

        try {
            return datasetsService.autocomplete(folder, entity.substring(0, 1), field, term.toLowerCase());
        } catch (IOException e) {
            throw new RuntimeException("Error reading schema for datasets");
        }
    }
}
