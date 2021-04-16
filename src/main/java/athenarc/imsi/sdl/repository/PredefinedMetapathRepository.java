package athenarc.imsi.sdl.repository;

import athenarc.imsi.sdl.domain.PredefinedMetapath;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredefinedMetapathRepository extends MongoRepository<PredefinedMetapath, String> {

    List<PredefinedMetapath> findPredefinedMetapathByDataset(String dataset);

    List<PredefinedMetapath> findPredefinedMetapathByDatasetAndMetapath(String dataset, List<String> metapath);

    PredefinedMetapath findFirstByDatasetAndMetapathAbbreviation(String dataset, String metapathAbbreviation);
}
