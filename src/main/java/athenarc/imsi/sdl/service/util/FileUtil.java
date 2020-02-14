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

import org.bson.Document;

import athenarc.imsi.sdl.config.Constants;

/**
 * Utility class for file and dir management.
 */
public final class FileUtil {


    private FileUtil() {
    }

    public static String createDir(String type, String uuid) {
        String dirname = Constants.BASE_PATH + "/" + type + "/" + uuid;
        File dir = new File(dirname);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return dirname;
    }

    public static String getLogfile(String type, String uuid) {
        return Constants.BASE_PATH + "/" + type + "/" + uuid + "/log.out";
    }

    public static String getRankingFIle(String type, String uuid) {
        return Constants.BASE_PATH + "/" + type + "/" + uuid + "/" + Constants.RANKING_OUT;
    }

    public static String getLastLine(String logfile) throws IOException {
        String lastLine = "";
        String sCurrentLine;

        BufferedReader br = new BufferedReader(new FileReader(logfile));

        while ((sCurrentLine = br.readLine()) != null)  {
            lastLine = sCurrentLine;
        }

        br.close();
        return lastLine;
    }

    public static String writeConfig(String outputDir, String metapath, Document constraints, String folder) throws IOException {
        Document config = new Document();
        config.put("indir", Constants.DATA_DIR + folder + "/nodes/");
        config.put("irdir", Constants.DATA_DIR + folder + "/relations/");
        config.put("algorithm", "DynP");
        config.put("hin_out", outputDir + "/" + Constants.HIN_OUT);
        config.put("ranking_out", outputDir + "/" + Constants.RANKING_TEMP);
        config.put("final_out", outputDir + "/" + Constants.RANKING_OUT);
        config.put("pr_alpha", 0.5);
        config.put("pr_tol", 0.00000000001);

        Document query = new Document();
        query.put("metapath", metapath);
        query.put("constraints", constraints);

        config.put("query", query);
        
        // write json to config file
        String configFile = outputDir + "/" + Constants.CONFIG_FILE;
        FileWriter fileWriter = new FileWriter(configFile);
        PrintWriter printWriter = new PrintWriter(fileWriter);
        printWriter.print(config.toJson());
        printWriter.close();

        return configFile;
    }

    public static int countLines(String filename) throws FileNotFoundException, IOException {
        FileReader input = new FileReader(filename);
        LineNumberReader count = new LineNumberReader(input);
        while (count.skip(Long.MAX_VALUE) > 0) { }
        int result = count.getLineNumber();
        count.close();
        return result;
    }

    public static int totalPages(int totalRecords) {
        int totalPages = (int) (totalRecords / Constants.PAGE_SIZE);
        if (totalRecords %  Constants.PAGE_SIZE > 0) {
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

    public static String readSchema(String filename) throws FileNotFoundException, IOException {
        File file = new File(filename);
        FileInputStream fis = new FileInputStream(file);
        byte[] data = new byte[(int) file.length()];
        fis.read(data);
        fis.close();
        return new String(data, "UTF-8");
    }
}
