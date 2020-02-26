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
    public static final String ANALYSIS_OUT = "ANALYSIS.csv";
    public static final String FINAL_OUT = "RESULT.csv";
    public static final String CONFIG_FILE = "config.json";

    public static final String DATA_DIR = "/dataX/scinem_data/";
    public static final String RANKING_WORKFLOW_DIR = "/opt/SciNeM-workflows/ranking";
    public static final int MAX_THREADS = 10;

    public static final int PAGE_SIZE = 50;

    private Constants() {
    }
}
