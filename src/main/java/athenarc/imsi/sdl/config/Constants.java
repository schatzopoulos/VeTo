package athenarc.imsi.sdl.config;

/**
 * Application constants.
 */
public final class Constants {

    // Regex for acceptable logins
    public static final String LOGIN_REGEX = "^[_.@A-Za-z0-9-]*$";
    
    public static final String SYSTEM_ACCOUNT = "system";
    public static final String DEFAULT_LANGUAGE = "en";
    public static final String ANONYMOUS_USER = "anonymoususer";
    
    public static final String BASE_PATH = "/tmp";
    public static final String HIN_OUT = "HIN.csv";
    public static final String RANKING_TEMP = "RANKING_TEMP.csv";
    public static final String RANKING_OUT = "RANKING.csv";
    public static final String CONFIG_FILE = "config.json";


    public static final String DBLP_NODES_DIR = "/opt/workflows/data/DBLP/nodes/";
    public static final String DBLP_RELARTIONS_DIR = "/opt/workflows/data/DBLP/relations/";
    public static final String WORKFLOWS_DIR = "/opt/workflows";
    public static final int MAX_THREADS = 10;

    public static final int PAGE_SIZE = 20;

    private Constants() {
    }
}
