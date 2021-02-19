package athenarc.imsi.sdl.service;

import athenarc.imsi.sdl.config.Constants;
import athenarc.imsi.sdl.domain.PredefinedMetapath;
import athenarc.imsi.sdl.repository.PredefinedMetapathRepository;
import athenarc.imsi.sdl.service.util.FileUtil;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

        List<PredefinedMetapath> result = this.predefinedMetapathRepository.findPredefinedMetapathByDataset(dataset);
        List<Document> predefinedMetapaths = new LinkedList<Document>();
        for (PredefinedMetapath metapath : result) {
            List<String> entities = metapath.getMetapath();
            String metapathAbbreviation = metapath.getMetapathAbbreviation();
            String key = metapath.getKey();
            String description = metapath.getDescription();

            int rankingFrequency = metapath.getAnalytics().getTimesUsed().getRanking();
            int simJoinFrequency = metapath.getAnalytics().getTimesUsed().getSimJoin();
            int simSearchFrequency = metapath.getAnalytics().getTimesUsed().getSimSearch();
            int communityDetectionFrequency = metapath.getAnalytics().getTimesUsed().getCommunityDetection();

            int rank = metapath.getAnalytics().getRank();

            Document metapathDoc = new Document();
            metapathDoc.append("metapath", entities);
            metapathDoc.append("metapathAbbreviation", metapathAbbreviation);
            metapathDoc.append("key", key);
            metapathDoc.append("description", description);

            Document stats = new Document();
            stats.append("rank", rank);
            stats.append("ranking", rankingFrequency);
            stats.append("simJoin", simJoinFrequency);
            stats.append("simSearch", simSearchFrequency);
            stats.append("communityDetection", communityDetectionFrequency);

            metapathDoc.append("stats",stats);

            predefinedMetapaths.add(metapathDoc);
        }

        return predefinedMetapaths;
    }

    public String getMetapathDescription(String dataset, List<String> entities) {
        String[] availableDatasets = FileUtil.findSubdirectories(Constants.DATA_DIR);
        boolean validDataset = Arrays.asList(availableDatasets).contains(dataset);
        if (!validDataset) {
            return null;
        }

        List<PredefinedMetapath> result = this.predefinedMetapathRepository.findPredefinedMetapathByDatasetAndMetapath(dataset, entities);
        if (result.size()>0) {
            return result.get(0).getDescription();
        }
        return "";
    }
}
