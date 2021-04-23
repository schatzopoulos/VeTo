package athenarc.imsi.sdl.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import athenarc.imsi.sdl.config.Constants;
import athenarc.imsi.sdl.repository.PredefinedMetapathRepository;
import athenarc.imsi.sdl.service.util.FileUtil;

@Service
public class AnalysisService {

    @Autowired
    private PredefinedMetapathRepository predefinedMetapathRepository;

    private final Logger log = LoggerFactory.getLogger(AnalysisService.class);

    @Async
    public void submit(
        String id, 
        ArrayList<String> expertSet, 
        double simThreshold, 
        int simMinValues, 
        int simsPerExpert, 
        double apvWeight,
        double aptWeight, 
        int outputSize) throws java.io.IOException, InterruptedException {

        // create folder to store results
        String outputDir = FileUtil.createDir(id);
        String outputLog = FileUtil.getLogfile(id);

        String config = FileUtil.writeConfig(outputDir, simThreshold, simMinValues, simsPerExpert, apvWeight, aptWeight, outputSize);
        FileUtil.writeExperts(outputDir, expertSet);

        // prepare ranking script arguments
        ProcessBuilder pb = new ProcessBuilder();

        pb.command("/bin/bash", Constants.WORKFLOW_DIR + "entrypoint.sh", config);

        // redirect ouput to logfile
        File out = new File(outputLog);
        pb.redirectOutput(out);

        // execute ranking script
        Process process = pb.start();
        int exitCode = process.waitFor();

        // write to file that the job has finished
        FileWriter fileWriter = new FileWriter(outputLog, true);
        PrintWriter printWriter = new PrintWriter(fileWriter);
        printWriter.print(exitCode + "\tExit Code");
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

    public List<Document> getCommunityResults(String analysisFile, Integer page, Document meta) throws IOException {
        if (page == null) {
            page = 1;
        }

        List<Document> docs = new ArrayList<>();
        List<Long> communityPositions = FileUtil.getCommunityPositions(analysisFile);
        int totalRecords = communityPositions.size();
        int totalPages = (int) Math.ceil(((double) totalRecords) / ((double) Constants.PAGE_SIZE));

        String[] headers = FileUtil.getHeaders(analysisFile);
        int firstCommunityIndex = (page - 1) * Constants.PAGE_SIZE;

        if (firstCommunityIndex < communityPositions.size()) {
            int communityColumnIndex;
            for (communityColumnIndex = 0; communityColumnIndex < headers.length; communityColumnIndex++) {
                if (headers[communityColumnIndex].equals("Community")) break;
            }

            boolean reachEnd = communityPositions.size() <= firstCommunityIndex + Constants.PAGE_SIZE;
            log.debug(reachEnd? "Will reach end":"Will dump 50 entries");
            long communityPositionLimit = reachEnd ? -1 : communityPositions.get(firstCommunityIndex + Constants.PAGE_SIZE);

            RandomAccessFile communityResultsFile = new RandomAccessFile(analysisFile, "r");
            Set<String> communityIds = new HashSet<>();
            long currentPosition;
            String line = null;
            communityResultsFile.seek(communityPositions.get(firstCommunityIndex));
            do {
                currentPosition = communityResultsFile.getFilePointer();
                if ((currentPosition < communityPositionLimit) || reachEnd) {
                    line = communityResultsFile.readLine();
                    if (line != null) {
                        String[] attributes = line.split("\t");
                        Document doc = new Document();
                        for (int i = 0; i < attributes.length; i++) {
                            doc.append(headers[i], attributes[i]);
                        }
                        docs.add(doc);
                    }
                }
            } while (((currentPosition < communityPositionLimit) || reachEnd) && (line != null));

        }

        AnalysisService.getMeta(meta, totalRecords, totalPages, page, headers);
        meta.append("community_counts", totalRecords);
        return docs;
    }

    public List<Document> getResults(String analysisFile, Integer page, Document meta) throws IOException {
        if (page == null)
            page = 1;

        List<Document> docs = new ArrayList<>();
        int totalRecords = FileUtil.countLines(analysisFile);
        int totalPages = FileUtil.totalPages(totalRecords);
        String[] headers = FileUtil.getHeaders(analysisFile);
        final int firstRecordNumber = (page - 1) * Constants.PAGE_SIZE + 1;

        int count = 0;
        Reader reader = Files.newBufferedReader(Paths.get(analysisFile));
        CSVReader csvReader = new CSVReaderBuilder(reader)
            .withCSVParser(new CSVParserBuilder().withSeparator('\t').build()).withSkipLines(firstRecordNumber)
            .build();

        String[] attributes;
        while (count < Constants.PAGE_SIZE && ((attributes = csvReader.readNext()) != null)) {

            // IMPORTANT: the order of the fields is indicated from the headers array in the
            // metadata section
            Document doc = new Document();
            for (int i = 0; i < attributes.length; i++) {
                doc.append(headers[i], attributes[i]);
            }

            docs.add(doc);
            count++;
        }

        AnalysisService.getMeta(meta, totalRecords, totalPages, page, headers);

        return docs;
    }

    public double getProgress(int step) {
        return (step / 7.0) * 100.0;
    }

    public Document getCommunityCounts(String detailsFile, List<Document> docs)
        throws FileNotFoundException, IOException {
        Document communityCounts = new Document();
        Document counts = Document.parse(FileUtil.readJsonFile(detailsFile));

        // get number of entities of each community in the results
        for (Document doc : docs) {
            System.out.println(doc);
            String entity = (String) doc.get("Community");

            int count = (int) counts.get(entity);
            communityCounts.append(entity, count);
        }

        // add total number of communities
        communityCounts.append("total", (int) counts.get("total"));
        return communityCounts;
    }
}
