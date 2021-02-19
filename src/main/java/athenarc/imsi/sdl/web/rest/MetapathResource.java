package athenarc.imsi.sdl.web.rest;

import athenarc.imsi.sdl.service.MetapathService;
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

    @GetMapping("/predefined")
    public Document getPredefinedMetapaths(@RequestParam(value = "dataset") String dataset) {
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

        return result;
    }

    @GetMapping("/description")
    public Document getMetapathDescription(
        @RequestParam(value = "dataset") String dataset,
        @RequestParam(value = "entities") List<String> entities) {
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
