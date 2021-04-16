package athenarc.imsi.sdl.web.rest;

import athenarc.imsi.sdl.service.MetapathService;
import io.swagger.annotations.*;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedList;
import java.util.List;

@RestController
@RequestMapping("/api/metapath")
public class MetapathResource {

    private final Logger log = LoggerFactory.getLogger(MetapathResource.class);

    @Autowired
    private MetapathService metapathService;

    @ApiOperation(value="This method is used to retrieve any available predefined metapaths for a given dataset")
    @ApiResponses(value =
        {
            @ApiResponse(code = 200, message = "Successfully found dataset and retrieved a list with predefined metapath information. An empty list means no predefined metapaths exist for the given dataset."),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 404, message = "Given dataset does not exist")
        }
    )
    @GetMapping(value = "/predefined", produces = "application/json;charset=UTF-8")
//    public SamplePredefinedMetapath getPredefinedMetapaths(@ApiParam(value="The dataset for which to search predefined metapaths", required = true) @RequestParam String dataset) {
    public Document getPredefinedMetapaths(@ApiParam(value="The dataset for which to search predefined metapaths", required = true) @RequestParam String dataset) {
        Document result = new Document();
        List<Document> predefinedMetapaths;

        result.append("dataset", dataset);
        if (dataset.trim().length() == 0) {
            predefinedMetapaths = new LinkedList<>();
        } else {
            predefinedMetapaths = metapathService.getPredefinedMetapaths(dataset);
        }
        if (predefinedMetapaths == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Dataset '"+dataset+"' does not exist");
        }
        result.append("predefinedMetapaths", predefinedMetapaths);

//        SamplePredefinedMetapath result2 = new SamplePredefinedMetapath("a","b");
        return result;
    }

    @ApiOperation(value="This method is used to retrieve the description for a specific metapath, of a specific dataset")
    @ApiResponses(value =
        {
            @ApiResponse(code = 200, message = "Successfully found dataset and retrieved a string describing the metapath. If the string is empty, no description exists for the given metapath."),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 404, message = "Given dataset does not exist")
        }
    )
    @GetMapping(value = "/description", produces = "application/json;charset=UTF-8")
    public Document getMetapathDescription(
        @ApiParam(value="The dataset for which to search predefined metapaths", required=true) @RequestParam String dataset,
        @ApiParam(value="Full name of entities that define the metapath. The metapath is defined by the order of entity definition", required = true) @RequestParam List<String> entities) {
        Document metapathInfo = new Document();

        metapathInfo.append("dataset", dataset);
        metapathInfo.append("entities", entities);

        String retrievedDescription = metapathService.getMetapathDescription(dataset, entities);
        if (retrievedDescription == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Dataset '"+dataset+"' does not exist");
        }
        metapathInfo.append("metapathDescription", retrievedDescription);

        return metapathInfo;
    }
}
