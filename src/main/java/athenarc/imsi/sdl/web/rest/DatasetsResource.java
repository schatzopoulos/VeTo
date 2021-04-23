package athenarc.imsi.sdl.web.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import athenarc.imsi.sdl.service.DatasetsService;
import athenarc.imsi.sdl.service.util.FileUtil;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

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
     * GET status
     */
    @ApiOperation(value = "Used to retrieve the names and schemas of the available datasets")
    @ApiResponses(value =
        {
            @ApiResponse(code = 200, message = "Responds with a dictionary, mapping each available dataset to its elements")
        }
    )
    @GetMapping(value = "/schemas", produces = "application/json;charset=UTF-8")
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
    @ApiOperation(value = "Used for searching a dataset and retrieving field values from a specific dataset entity, that contain a given literal")
    @ApiResponses(value =
        {
            @ApiResponse(code = 200, message = "Responds with a list of values")
        }
    )
    @GetMapping("/autocomplete")
    public List<Document> autocomplete(@RequestParam(value = "term") String term) {

        // give terms to service so that it can check whether the all of the terms exist
        // in case of an error during the service execution throw a runtime error
        // in case of a successful service execution, return the service result
        try {
            return datasetsService.autocomplete(term.toLowerCase());
        } catch (IOException e) {
            throw new RuntimeException("Error reading schema for datasets");
        }
    }

    /**
    * GET status
    */
    @GetMapping("/get")
    public Document get(@RequestParam(value = "term") String term) {

        try {
            return datasetsService.get(term.toLowerCase());
        } catch (IOException e) {
            throw new RuntimeException("Error reading schema for datasets");
        }
    }
    /**
    * GET download result
    */
    @GetMapping(value = "/download", produces = "text/csv; charset=utf-8")
    public ResponseEntity<Resource> download(String analysisType, String id) {

        try {
            String downloadFile = FileUtil.getOutputFile(id);
            File fd = new File(downloadFile);
            InputStreamResource resource = new InputStreamResource(new FileInputStream(fd));

            HttpHeaders headers = new HttpHeaders();
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");

            return ResponseEntity.ok()
                .headers(headers)
                .contentLength(fd.length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);

        } catch (FileNotFoundException e) {
            throw new RuntimeException("Error downloading result file");
        }
    }
}
