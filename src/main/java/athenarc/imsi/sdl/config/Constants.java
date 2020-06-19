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
    
    public static final String BASE_PATH = "/dataX/SciNeM-results";
    public static final String HIN_OUT = "HIN";
    public static final String ANALYSIS_OUT = "ANALYSIS.csv";
    public static final String RANKING_OUT = "RANKING";
    public static final String COMMUNITY_DETECTION_OUT = "COMMUNITIES";

    public static final String FINAL_OUT = "RESULT.csv";
    public static final String CONFIG_FILE = "config.json";

    public static final String DATA_DIR = "/dataX/SciNeM-data/";
    public static final String WORKFLOW_DIR = "/opt/SciNeM-workflows/";
    public static final int MAX_THREADS = 10;

    public static final int PAGE_SIZE = 50;

    private Constants() {
    }
}
