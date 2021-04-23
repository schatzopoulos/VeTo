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
    
    public static final String BASE_PATH = "/dataX/VeTo/VeTo-results";
    public static final String APV_SIMS_DIR = "APV_SIMS";
    public static final String APT_SIMS_DIR = "APT_SIMS";
    public static final String EXPERT_SET = "EXPERT_SET";
    public static final String VETO_OUTPUT = "VETO_OUTPUT";
    public static final String FINAL_OUTPUT = "RESULT";

    public static final String CONFIG_FILE = "config.json";

    public static final String DATA_DIR = "/dataX/VeTo/VeTo-data/";
    public static final String WORKFLOW_DIR = "/dataX/VeTo/VeTo-workflows/";
    public static final int MAX_THREADS = 10;

    public static final int PAGE_SIZE = 50;

    private Constants() {
    }
}
