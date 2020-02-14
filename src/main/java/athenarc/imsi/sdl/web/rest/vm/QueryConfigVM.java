package athenarc.imsi.sdl.web.rest.vm;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.bson.Document;

/**
 * View Model object for storing a user's credentials.
 */
public class QueryConfigVM {

    @NotNull
    @Size(min = 1, max = 50)
    private String metapath;
    private String folder;

    @NotNull
    private Document constraints;

    public String getMetapath() {
        return metapath;
    }

    public void setMetapath(String metapath) {
        this.metapath = metapath;
    }

    public Document getConstraints() {
        return this.constraints;
    }

    public void setConstraints(Document constraints) {
        this.constraints = constraints;
    }

    public String getFolder() {
        return this.folder;
    }

    public void setFolder(String _folder) {
        this.folder = _folder;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("RankingParamsVM {");
        sb.append("\tmetapath: " + this.metapath);
        sb.append("\tconstraint: " + this.constraints.toString());       
        sb.append("\tfolder: " + this.folder);
        sb.append("}");
        return sb.toString();
    }
}
