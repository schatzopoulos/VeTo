package athenarc.imsi.sdl.service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import athenarc.imsi.sdl.config.Constants;
import athenarc.imsi.sdl.service.util.FileUtil;
@Service
public class SimilarityService {

    private final Logger log = LoggerFactory.getLogger(SimilarityService.class);

    @Async
    public void submit(String id, String operation, String metapath, int k, int t, int w, int minValues, String folder, String selectField, int targetId) 
        throws java.io.IOException, InterruptedException {
        
        // create folder to store results
        String outputDir = FileUtil.createDir(operation, id);
        String outputLog = FileUtil.getLogfile(operation, id);
        
        String config = FileUtil.writeConfig(operation, outputDir, metapath, null, k, t, w, minValues, folder, selectField, -1);

        // prepare ranking script arguments
        ProcessBuilder pb = new ProcessBuilder();
        pb.command("/bin/bash", Constants.WORKFLOW_DIR + "similarity/entity_similarity.sh", config);
        
        // redirect ouput to logfile
        File out = new File(outputLog);
        pb.redirectOutput(out);

        // execute ranking script
        Process process = pb.start();
        int exitCode = process.waitFor();

        // write to file that the job has finished
        FileWriter fileWriter = new FileWriter(outputLog, true);
        PrintWriter printWriter = new PrintWriter(fileWriter);
        printWriter.print("Exit Code\t" + exitCode);
        printWriter.close();

        log.debug("SimJoin task for id: " + id + " exited with code: " + exitCode);
    }

    private static void getMeta(Document meta, int totalRecords, int totalPages, int page) {
        meta.append("totalRecords", totalRecords);
        meta.append("page", page);
        meta.append("totalPages", totalPages);
        meta.append("pageSize", Constants.PAGE_SIZE);

        Document links = new Document();
        links.append("hasNext", (page < totalPages) ? true : false);
        links.append("hasPrev", (page > 1) ? true : false);
        meta.append("links", links);
    }

    public List<Document> getResults(String analysisFile, Integer page, Document meta) throws IOException{
        if (page == null) 
            page = 1;
        
        List<Document> docs = new ArrayList<>();
        int totalRecords = FileUtil.countLines(analysisFile);
        int totalPages = FileUtil.totalPages(totalRecords);
        final int firstRecordNumber = (page - 1) * Constants.PAGE_SIZE + 1;

        int count = 0;
        Reader reader = Files.newBufferedReader(Paths.get(analysisFile));
        CSVReader csvReader =  new CSVReaderBuilder(reader)
            .withCSVParser(new CSVParserBuilder().withSeparator('\t').build())
            .withSkipLines(firstRecordNumber-1)
            .build();

        String[] attributes;
        while (count < Constants.PAGE_SIZE && ((attributes = csvReader.readNext()) != null)) {
            
            String[] srcTokens = attributes[0].split("\\|");
            String[] destTokens = attributes[1].split("\\|");

            // print information to output here
            Document doc = new Document()
                .append("src", new Document().append("id", Integer.parseInt(srcTokens[0])).append("name", srcTokens[1]))
                .append("dest", new Document().append("id", Integer.parseInt(destTokens[0])).append("name", destTokens[1]))
                .append("score", Float.parseFloat(attributes[2]));
            docs.add(doc);
            count++;
        }

        SimilarityService.getMeta(meta, totalRecords, totalPages, page);

        return docs;
    }

    public double getProgress(String stage, int step) {
        if (stage.equals("Associations Mining")) {
            return (step / 7.0) * 50;
        } else {
            return (step / 5.0) * 50 + 50;
        }
    }
}
