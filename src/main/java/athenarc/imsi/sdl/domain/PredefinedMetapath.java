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
    private String key;
    private String description;

    public PredefinedMetapath() {
    }

    public PredefinedMetapath(String id, String dataset, List<String> metapath, String key, String description) {
        this.id = id;
        this.dataset = dataset;
        this.metapath = metapath;
        this.key = key;
        this.description = description;
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

    @Override
    public String toString() {
        StringBuilder metapathBuilder = new StringBuilder();
        for (String entity : this.metapath) {
            char entityCharacter = entity.toUpperCase().charAt(0);
            metapathBuilder.append(entityCharacter);
        }
        String metapath = metapathBuilder.toString();
        return "Predefined metapath for dataset '" + this.dataset + "' - " + this.description + " - " + metapath + " - key: " + this.key;
    }
}
