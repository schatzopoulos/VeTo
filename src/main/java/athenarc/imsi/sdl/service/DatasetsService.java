package athenarc.imsi.sdl.service;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import athenarc.imsi.sdl.config.Constants;
import athenarc.imsi.sdl.service.util.FileUtil;

@Service
public class DatasetsService {

    private final Logger log = LoggerFactory.getLogger(DatasetsService.class);

    public String upload(String filename, byte[] bytes) throws java.io.IOException {
        log.debug("Uploading " + filename);
        String zipFile = Constants.DATA_DIR + filename;
        Path path = Paths.get(zipFile);
        Files.write(path, bytes);
        return zipFile;
    }

    public Document getSchemas() throws FileNotFoundException, IOException {
        Document response = new Document();

        String [] datasetDirs = FileUtil.findSubdirectories(Constants.DATA_DIR);

        for(String dir : datasetDirs) {
            String schemaFile = Constants.DATA_DIR + dir + "/schema.json";
            // System.out.println(FileUtil.readSchema(schemaFile));
            Document schema = Document.parse(FileUtil.readJsonFile(schemaFile));
            schema.append("folder", dir);
            response.append(schema.get("name").toString(), schema);
            schema.remove("name");
        }
        return response;
    }

    public List<Document> autocomplete(String term) throws IOException {
        List<Document> docs = new ArrayList<>();

        BufferedReader reader;
        String filename = Constants.DATA_DIR + "A.csv";
        reader = new BufferedReader(new FileReader(filename));

        // read header line and find column of specified field
        String line = reader.readLine();

        int i = 1;

        // loop in lines until find 5 results to return
        while ( ( line = reader.readLine() ) != null) {
            String [] attrs = line.split("\t");

            if (i >= attrs.length) continue;

            if (attrs[i].toLowerCase().contains(term)) {

                Document doc = new Document();
                doc.append("id", Integer.parseInt(attrs[0]));
                doc.append("name", attrs[i]);
                docs.add(doc);

                // System.out.println(values.size());
                if (docs.size() == 5) {
                   break;
                }
            }
        }
        reader.close();

        return docs;
    }

    public Document get(String term) throws IOException {
        Document doc = new Document();

        BufferedReader reader;
        String filename = Constants.DATA_DIR + "A.csv";
        reader = new BufferedReader(new FileReader(filename));
        
        // read header line and find column of specified field
        String line = reader.readLine();

        int i = 1;

        // loop in lines until find 5 results to return
        while ( ( line = reader.readLine() ) != null) {
            String [] attrs = line.split("\t");

            if (attrs[i].toLowerCase().equals(term)) {
                doc.append("id", Integer.parseInt(attrs[0]));
                doc.append("name", attrs[i]);
                return doc;
            }
        }
        reader.close();
		
        return doc;
    }
}
