package athenarc.imsi.sdl.web.rest.vm;

import java.util.ArrayList;

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
    @Size(min = 1, max = 50)
    private String joinpath;

    @NotNull
    private String folder;

    @NotNull
    private Document constraints;

    @NotNull
    private String selectField;

    @NotNull
    private ArrayList<String> analysis;

    private String constraintsExpression;

    @NotNull
    private String primaryEntity;

    private int searchK;
    private int joinK;
    private int searchMinValues;
    private int joinMinValues;
    private int t;
    private int searchW;
    private int joinW;
    private int minValues;
    private int targetId;
    private int edgesThreshold;
    private double prAlpha;
    private double prTol;

    public void setConstraintsExpression(String constraintsExpression) {
        this.constraintsExpression=constraintsExpression;
    }

    public String getConstraintsExpression() {
        return this.constraintsExpression;
    }

    public String getPrimaryEntity() {
        return primaryEntity;
    }

    public void setPrimaryEntity(String primaryEntity) {
        this.primaryEntity = primaryEntity;
    }

    public double getPrAlpha() {
        return this.prAlpha;
    }

    public void setPrAlpha(double prAlpha) {
        this.prAlpha = prAlpha;
    }

    public double getPrTol() {
        return this.prTol;
    }

    public void setPrTol(double prTol) {
        this.prTol = prTol;
    }

    public int getEdgesThreshold() {
        return this.edgesThreshold;
    }

    public void setEdgesThreshold(int edgesThreshold) {
        this.edgesThreshold = edgesThreshold;
    }

    public String getMetapath() {
        return metapath;
    }

    public int getSearchK() {
        return this.searchK;
    }

    public void setSearchK(int searchK) {
        this.searchK = searchK;
    }

    public int getJoinK() {
        return this.joinK;
    }

    public void setJoinK(int joinK) {
        this.joinK = joinK;
    }

    public int getSearchMinValues() {
        return this.searchMinValues;
    }

    public void setSearchMinValues(int searchMinValues) {
        this.searchMinValues = searchMinValues;
    }

    public int getJoinMinValues() {
        return this.joinMinValues;
    }

    public void setJoinMinValues(int joinMinValues) {
        this.joinMinValues = joinMinValues;
    }

    public int getT() {
        return this.t;
    }

    public void setT(int t) {
        this.t = t;
    }

    public int getSearchW() {
        return this.searchW;
    }

    public void setSearchW(int searchW) {
        this.searchW = searchW;
    }

    public int getJoinW() {
        return this.joinW;
    }

    public void setJoinW(int joinW) {
        this.joinW = joinW;
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

    public ArrayList<String> getAnalysis() {
        return this.analysis;
    }

    public void setAnalysis(ArrayList<String> analysis) {
        this.analysis = analysis;
    }

    public String getJoinpath() {
        return this.joinpath;
    }

    public void setJoinpath(String joinpath) {
        this.joinpath = joinpath;
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
