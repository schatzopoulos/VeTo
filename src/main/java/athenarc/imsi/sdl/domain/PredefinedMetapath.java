package athenarc.imsi.sdl.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "predefinedMetapath")
public class PredefinedMetapath {

    @Id
    private String id;

    private String dataset;
    private List<String> metapath;
    private String metapathAbbreviation;
    private String key;
    private String description;
    private Analytics analytics;

    public PredefinedMetapath() {
    }

    public PredefinedMetapath(
        String id, String dataset, List<String> metapath, String metapathAbbreviation, String key, String description,
        Analytics analytics
    ) {
        this.id = id;
        this.dataset = dataset;
        this.metapath = metapath;
        this.metapathAbbreviation = metapathAbbreviation;
        this.key = key;
        this.description = description;
        this.analytics = analytics;
    }

    public String getMetapathAbbreviation() {
        return metapathAbbreviation;
    }

    public void setMetapathAbbreviation(String metapathAbbreviation) {
        this.metapathAbbreviation = metapathAbbreviation;
    }

    public String getId() {
        return id;
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }

    public List<String> getMetapath() {
        return metapath;
    }

    public void setMetapath(List<String> metapath) {
        this.metapath = metapath;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Analytics getAnalytics() {
        return analytics;
    }

    public void setAnalytics(Analytics analytics) {
        this.analytics = analytics;
    }

    @Override
    public String toString() {
        return "Predefined metapath for dataset '" + this.dataset + "' - " + this.description + " - " + this.metapathAbbreviation + " - key: " + this.key + " - analytics: [" + this.analytics.toString() + "]";
    }

    public static class Analytics {
        private TimesUsed timesUsed;
        private int rank;

        public Analytics() {

        }

        public Analytics(TimesUsed timesUsed, int rank) {
            this.timesUsed=timesUsed;
            this.rank=rank;
        }

        public TimesUsed getTimesUsed() {
            return timesUsed;
        }

        public void setTimesUsed(TimesUsed timesUsed) {
            this.timesUsed = timesUsed;
        }

        public int getRank() {
            return rank;
        }

        public void setRank(int rank) {
            this.rank = rank;
        }

        @Override
        public String toString() {
            return "rank: " + this.rank + ", counts per analysis: [" + this.timesUsed.toString() + "]";
        }

        public static class TimesUsed {

            private int ranking;
            private int simJoin;
            private int simSearch;
            private int communityDetection;

            public TimesUsed() {

            }

            public TimesUsed(int ranking, int simJoin, int simSearch, int communityDetection) {
                this.ranking=ranking;
                this.simJoin=simJoin;
                this.simSearch=simSearch;
                this.communityDetection=communityDetection;
            }

            public int getRanking() {
                return ranking;
            }

            public void setRanking(int ranking) {
                this.ranking = ranking;
            }

            public int getSimJoin() {
                return simJoin;
            }

            public void setSimJoin(int simJoin) {
                this.simJoin = simJoin;
            }

            public int getSimSearch() {
                return simSearch;
            }

            public void setSimSearch(int simSearch) {
                this.simSearch = simSearch;
            }

            public int getCommunityDetection() {
                return communityDetection;
            }

            public void setCommunityDetection(int communityDetection) {
                this.communityDetection = communityDetection;
            }

            @Override
            public String toString() {
                return "ranking: " + this.ranking + ", similarity join: " + this.simJoin + ", similarity search: " + this.simSearch + ", community detection: " + this.communityDetection;
            }
        }
    }
}
