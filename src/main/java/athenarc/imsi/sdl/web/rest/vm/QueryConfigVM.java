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

    @NotNull
    private String folder;
    
    @NotNull
    private Document constraints;

    @NotNull
    private String selectField;
    
    @NotNull
    private String analysis;

    private int k;
    private int t;
    private int w;
    private int minValues;
    private int targetId;

    public String getMetapath() {
        return metapath;
    }

    public int getK() {
        return this.k;
    }

    public void setK(int k) {
        this.k = k;
    }

    public int getT() {
        return this.t;
    }

    public void setT(int t) {
        this.t = t;
    }

    public int getW() {
        return this.w;
    }

    public void setW(int w) {
        this.w = w;
    }

    public int getMinValues() {
        return this.minValues;
    }

    public void setMinValues(int minValues) {
        this.minValues = minValues;
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

    public String getSelectField() {
        return this.selectField;
    }

    public void setSelectField(String selectField) {
        this.selectField = selectField;
    }

    public int getTargetId() {
        return this.targetId;
    }

    public void setTargetId(int targetId) {
        this.targetId = targetId;
    }

    public String getAnalysis() {
        return this.analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
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
