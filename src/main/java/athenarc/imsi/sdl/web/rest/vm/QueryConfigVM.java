package athenarc.imsi.sdl.web.rest.vm;

import java.util.ArrayList;

import javax.validation.constraints.NotNull;

/**
 * View Model object for storing a user's credentials.
 */
public class QueryConfigVM {

    @NotNull
    private ArrayList<String> expertSet;

    @NotNull
    private double simThreshold;

    @NotNull
    private int simMinValues;

    @NotNull
    private int simsPerExpert;
    
    @NotNull
    private double apvWeight;

    @NotNull
    private double aptWeight;

    @NotNull
    private int outputSize;
    
    public ArrayList<String> getExpertSet() {
        return expertSet;
    }

    public void setExpertSet(final ArrayList<String> expertSet) {
        this.expertSet = expertSet;
    }

    public double getSimThreshold() {
        return simThreshold;
    }

    public void setSimThreshold(final double simThreshold) {
        this.simThreshold = simThreshold;
    }

    public int getSimMinValues() {
        return simMinValues;
    }

    public void setSimMinValues(final int simMinValues) {
        this.simMinValues = simMinValues;
    }

    public int getSimsPerExpert() {
        return simsPerExpert;
    }

    public void setSimsPerExpert(int simsPerExpert) {
        this.simsPerExpert = simsPerExpert;
    }

    public double getApvWeight() {
        return apvWeight;
    }

    public void setApvWeight(double apvWeight) {
        this.apvWeight = apvWeight;
    }

    public double getAptWeight() {
        return aptWeight;
    }

    public void setAptWeight(double aptWeight) {
        this.aptWeight = aptWeight;
    }

    public int getOutputSize() {
        return outputSize;
    }

    public void setOutputSize(int outputSize) {
        this.outputSize = outputSize;
    }

}
