package athenarc.imsi.sdl.service.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.LineNumberReader;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bson.Document;

import athenarc.imsi.sdl.config.Constants;

/**
 * Utility class for file and dir management.
 */
public final class FileUtil {


    private FileUtil() {
    }

    public static String createDir(String uuid) {
        String dirname = Constants.BASE_PATH + "/" + uuid;
        File dir = new File(dirname);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return dirname;
    }

    public static Boolean dirExists(String uuid) {
        String dirname = Constants.BASE_PATH + "/" + uuid;
        File dir = new File(dirname);
        return dir.exists();
    }

    public static String getLogfile(String uuid) {
        return Constants.BASE_PATH + "/" + uuid + "/log.out";
    }

    public static String getConfFile(String uuid) {
        return Constants.BASE_PATH + "/" + uuid + "/" + Constants.CONFIG_FILE;
    }

    public static String getOutputFile(String uuid) {
        return Constants.BASE_PATH + "/" + uuid + "/" + Constants.FINAL_OUTPUT;
    }

    public static String getCommunityDetailsFile(String uuid) {
        // return Constants.BASE_PATH + "/" + uuid + "/" + Constants.COMMUNITY_DETAILS;
        return "";
    }


    public static Document parseLogfile(String logfile) throws IOException {
        String lastLine = "";
        Integer stageNum = 0;
        String prevAnalysis = "";
        String sCurrentLine;
        ArrayList<String> completedStages = new ArrayList<>();

        BufferedReader br = new BufferedReader(new FileReader(logfile));

        while ((sCurrentLine = br.readLine()) != null) {
            String[] tokens = sCurrentLine.split("\\t");
            lastLine = sCurrentLine;

            if (tokens.length != 3) // in case of last line with exit code
                continue;

            if (!tokens[0].equals(prevAnalysis)) {
                prevAnalysis = tokens[0];
                stageNum++;
            }

            // return stages that have been completed
            if (tokens[2].equals("Completed")) {
                completedStages.add(tokens[0]);
            }
        }

        br.close();
        return new Document()
            .append("lastLine", lastLine)
            .append("stageNum", stageNum)
            .append("completedStages", completedStages);
    }

    public static String writeConfig(
        String outputDir,
        double simThreshold,
        int simMinValues,
        int simsPerExpert, 
        double apvWeight,
        double aptWeight, 
        int outputSize
    ) throws IOException {

        Document config = new Document();       
        
        config.put("apv_hin", Constants.DATA_DIR + "APV-HIN.csv");
        config.put("apt_hin", Constants.DATA_DIR + "APT-HIN.csv");
        config.put("author_names", Constants.DATA_DIR + "A.csv");
        config.put("expert_set", outputDir + "/" + Constants.EXPERT_SET);

        config.put("apv_sims_dir", outputDir + "/" + Constants.APV_SIMS_DIR);
        config.put("apt_sims_dir", outputDir + "/" + Constants.APT_SIMS_DIR);
        config.put("veto_output", outputDir + "/" + Constants.VETO_OUTPUT);
        config.put("final_output", outputDir + "/" + Constants.FINAL_OUTPUT);

        config.put("sim_threshold", simThreshold);
        config.put("sim_min_values", simMinValues);
        config.put("sims_per_expert", simsPerExpert);
        config.put("apv_weight", apvWeight);
        config.put("apt_weight", aptWeight);
        config.put("output_size", outputSize);

        // write json to config file
        String configFile = outputDir + "/" + Constants.CONFIG_FILE;
        FileWriter fileWriter = new FileWriter(configFile);
        PrintWriter printWriter = new PrintWriter(fileWriter);
        printWriter.print(config.toJson());
        printWriter.close();

        return configFile;
    }

    public static void writeExperts(String outputDir, ArrayList<String> experts) throws IOException {
        String expertsFile = outputDir + "/" + Constants.EXPERT_SET;
        FileWriter fileWriter = new FileWriter(expertsFile);
        PrintWriter printWriter = new PrintWriter(fileWriter);
        for (String expert : experts) {
            printWriter.println(expert);
        }
        printWriter.close();
    }

    public static String[] getHeaders(String filename) throws FileNotFoundException, IOException {
        BufferedReader bf = new BufferedReader(new FileReader(filename));
        String firstLine = bf.readLine();
        String[] headers = firstLine.split("\t");
        bf.close();
        return headers;
    }

    public static int countLines(String filename) throws FileNotFoundException, IOException {
        FileReader input = new FileReader(filename);
        LineNumberReader count = new LineNumberReader(input);
        while (count.skip(Long.MAX_VALUE) > 0) {
        }
        int result = count.getLineNumber();
        count.close();
        return result - 1;    //remove header
    }

    public static int totalPages(int totalRecords) {
        int totalPages = (int) (totalRecords / Constants.PAGE_SIZE);
        if (totalRecords % Constants.PAGE_SIZE > 0) {
            totalPages++; // increase totalPages if there's a division remainder
        }
        return totalPages;
    }

    public static int unzip(String zipFile) throws java.io.IOException, InterruptedException {

        ProcessBuilder pb = new ProcessBuilder();
        pb.command("unzip", "-n", zipFile, "-d", Constants.DATA_DIR);
        Process process = pb.start();
        return process.waitFor();
    }

    public static List<String> getLocalDatasets() {
        File file = new File(Constants.DATA_DIR);
        String[] directories = file.list(new FilenameFilter() {
          @Override
          public boolean accept(File current, String name) {
            return new File(current, name).isDirectory();
          }
        });
        return Arrays.asList(directories);
    }

    public static boolean remove(String filename) {
        File file = new File(filename);
        return file.delete();
    }

    public static String[] findSubdirectories(String rootDir) {
        return new File(rootDir).list(new FilenameFilter() {
            @Override
            public boolean accept(File current, String name) {
                return new File(current, name).isDirectory();
            }
        });
    }

    public static String readJsonFile(String filename) throws FileNotFoundException, IOException {
        File file = new File(filename);
        FileInputStream fis = new FileInputStream(file);
        byte[] data = new byte[(int) file.length()];
        fis.read(data);
        fis.close();
        return new String(data, "UTF-8");
    }

    public static Document getAnalysesParameters(final Document config) {
        ArrayList<String> ananyses = (ArrayList<String>) config.get("analyses");

        Document query = (Document) config.get("query");
        String metapath = (String) query.get("metapath");

        ArrayList<String> constraints = new ArrayList<>();
        for (final Map.Entry<String, Object> entry : ((Document) query.get("constraints")).entrySet()) {
            constraints.add(entry.getKey() + ": " + ((String) entry.getValue()));
        }

        Document analysisParameters = new Document();
        analysisParameters.append("analyses", ananyses);
        analysisParameters.append("metapath", metapath);
        analysisParameters.append("constraints", constraints);

        return analysisParameters;
    }

    public static List<Long> getCommunityPositions(String file) throws IOException {
        Set<String> communityIdsSet = new HashSet<>();
        List<Long> communityPositions = new ArrayList<>();
        RandomAccessFile communityFile = new RandomAccessFile(file, "r");
        String[] headers = communityFile.readLine().split("\t");
        int communityColumnIndex;
        for (communityColumnIndex = 0; communityColumnIndex < headers.length; communityColumnIndex++) {
            if (headers[communityColumnIndex].equals("Community")) break;
        }

        String line;
        do {
            long linePosition = communityFile.getFilePointer();
            line = communityFile.readLine();
            if (line != null) {
                String communityId = line.split("\t")[communityColumnIndex];

                if (!communityIdsSet.contains(communityId)) {
                    communityIdsSet.add(communityId);
                    communityPositions.add(linePosition);
                }
            }
        } while (line!=null);

        return communityPositions;
    }
}
