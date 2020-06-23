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
public class AnalysisService {

    private final Logger log = LoggerFactory.getLogger(AnalysisService.class);

    @Async
    public void submit(
        String id, 
        ArrayList<String> analysis, 
        String metapath, 
        String joinpath,
        Document constraints,
        int joinK, 
        int searchK,
        int t, 
        int joinW,
        int searchW,
        int minValues,
        int targetId,
        String folder, 
        String selectField,
        int edgesThreshold,
        double prAlpha, 
        double prTol,
        int joinMinValues, 
        int searchMinValues) throws java.io.IOException, InterruptedException {
        
        // create folder to store results
        String outputDir = FileUtil.createDir(id);
        String outputLog = FileUtil.getLogfile(id);
        
        String config = FileUtil.writeConfig(
            analysis, 
            outputDir, 
            metapath, 
            joinpath,
            constraints, 
            joinK,
            searchK, 
            t, 
            joinW, 
            searchW,
            minValues, 
            targetId,
            folder, 
            selectField,
            edgesThreshold,
            prAlpha, 
            prTol,
            joinMinValues,
            searchMinValues
        );

        // prepare ranking script arguments
        ProcessBuilder pb = new ProcessBuilder();

        pb.command("/bin/bash", Constants.WORKFLOW_DIR + "analysis/analysis.sh", config);

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

        log.debug("Analysis task for id: " + id + " exited with code: " + exitCode);
    }

    private static void getMeta(Document meta, int totalRecords, int totalPages, int page, String[] headers) {
        meta.append("totalRecords", totalRecords);
        meta.append("page", page);
        meta.append("totalPages", totalPages);
        meta.append("pageSize", Constants.PAGE_SIZE);

        Document links = new Document();
        links.append("hasNext", (page < totalPages) ? true : false);
        links.append("hasPrev", (page > 1) ? true : false);
        meta.append("links", links);
        meta.append("headers", headers);
    }

    public List<Document> getResults(String analysisFile, Integer page, Document meta) throws IOException{
        if (page == null) 
            page = 1;
        
        List<Document> docs = new ArrayList<>();
        int totalRecords = FileUtil.countLines(analysisFile);
        int totalPages = FileUtil.totalPages(totalRecords);
        String[] headers = FileUtil.getHeaders(analysisFile);
        final int firstRecordNumber = (page - 1) * Constants.PAGE_SIZE + 1;

        int count = 0;
        Reader reader = Files.newBufferedReader(Paths.get(analysisFile));
        CSVReader csvReader =  new CSVReaderBuilder(reader)
            .withCSVParser(new CSVParserBuilder().withSeparator('\t').build())
            .withSkipLines(firstRecordNumber)
            .build();

        String[] attributes;
        while (count < Constants.PAGE_SIZE && ((attributes = csvReader.readNext()) != null)) {

            // IMPORTANT: the order of the fields is indicated from the headers array in the metadata section
            Document doc = new Document();
            for (int i=0; i<attributes.length; i++) {
                doc.append(headers[i], attributes[i]);
            }

            docs.add(doc);
            count++;
        }

        AnalysisService.getMeta(meta, totalRecords, totalPages, page, headers);

        return docs;
    }

    public double getProgress(ArrayList<String> analyses, int stage, int step) {
        return (step / 3.0) * (100.0 / (analyses.size()+1)) + (stage-1) * (100.0 / (analyses.size()+1));
    }
}
