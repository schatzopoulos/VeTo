package athenarc.imsi.sdl.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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
            Document schema = Document.parse(FileUtil.readSchema(schemaFile));
            schema.append("folder", dir);
            response.append(schema.get("name").toString(), schema);
            schema.remove("name");
        }
        return response;
    }
}
