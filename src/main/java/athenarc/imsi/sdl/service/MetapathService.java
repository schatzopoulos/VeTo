package athenarc.imsi.sdl.service;

import athenarc.imsi.sdl.config.Constants;
import athenarc.imsi.sdl.domain.PredefinedMetapath;
import athenarc.imsi.sdl.repository.PredefinedMetapathRepository;
import athenarc.imsi.sdl.service.util.FileUtil;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MetapathService {

    @Autowired
    private PredefinedMetapathRepository predefinedMetapathRepository;

    private final Logger log = LoggerFactory.getLogger(MetapathService.class);

    public List<Document> getPredefinedMetapaths(String dataset) {
        String[] availableDatasets = FileUtil.findSubdirectories(Constants.DATA_DIR);
        boolean validDataset = Arrays.asList(availableDatasets).contains(dataset);
        if (!validDataset) {
            return null;
        }

        List<PredefinedMetapath> result = this.predefinedMetapathRepository.findByDataset(dataset);
        List<Document> predefinedMetapaths = new LinkedList<Document>();
        for (PredefinedMetapath metapath : result) {
            List<String> entities = metapath.getMetapath();
            String key = metapath.getKey();
            String description = metapath.getDescription();

            Document metapathDoc = new Document();
            metapathDoc.append("metapath", entities);
            metapathDoc.append("key", key);
            metapathDoc.append("description", description);

            predefinedMetapaths.add(metapathDoc);
        }

        return predefinedMetapaths;
    }
}
