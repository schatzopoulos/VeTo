package athenarc.imsi.sdl.web.rest;

import athenarc.imsi.sdl.SpOtApp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
/**
 * Test class for the RankingResource REST controller.
 *
 * @see RankingResource
 */
@SpringBootTest(classes = SpOtApp.class)
public class RankingResourceIT {

    private MockMvc restMockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        RankingResource rankingResource = new RankingResource();
        restMockMvc = MockMvcBuilders
            .standaloneSetup(rankingResource)
            .build();
    }

    /**
     * Test submit
     */
    @Test
    public void testSubmit() throws Exception {
        restMockMvc.perform(post("/api/ranking/submit"))
            .andExpect(status().isOk());
    }

    /**
     * Test status
     */
    @Test
    public void testStatus() throws Exception {
        restMockMvc.perform(get("/api/ranking/status"))
            .andExpect(status().isOk());
    }
}
