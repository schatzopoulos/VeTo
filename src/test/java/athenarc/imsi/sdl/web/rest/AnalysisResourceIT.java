package athenarc.imsi.sdl.web.rest;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import athenarc.imsi.sdl.SpOtApp;
/**
 * Test class for the RankingResource REST controller.
 *
 * @see DatasetsResource
 */
@SpringBootTest(classes = SpOtApp.class)
public class AnalysisResourceIT {

    private MockMvc restMockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        AnalysisResource rankingResource = new AnalysisResource();
        restMockMvc = MockMvcBuilders
            .standaloneSetup(rankingResource)
            .build();
    }

    // /**
    //  * Test submit
    //  */
    // @Test
    // public void testSubmit() throws Exception {
    //     restMockMvc.perform(post("/api/analysis/submit")
    //     .contentType(MediaType.APPLICATION_JSON)
    //     .content("{ \"analysis\": \"ranking\", \"metapath\": \"APA\", \"constraints\": { \"P\": \"year > 2015\" }, \"folder\": \"DBLP\", \"selectField\": \"name\" }"))    
    //     .andExpect(status().isOk());
    // }

    // /**
    //  * Test status
    //  */
    // @Test
    // public void testStatus() throws Exception {
    //     MvcResult result = restMockMvc.perform(post("/api/analysis/submit")
    //     .contentType(MediaType.APPLICATION_JSON)
    //     .content("{  \"analysis\": \"ranking\", \"metapath\": \"APA\", \"constraints\": { \"P\": \"year > 2015\" }, \"folder\": \"DBLP\", \"selectField\": \"name\" }")) 
    //     .andExpect(status().isOk()).andReturn();
    //     String content = result.getResponse().getContentAsString();
    //     Document response = Document.parse(content);
    //     String uuid = response.getString("id");

    //     MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get("/api/analysis/get");
    //     requestBuilder.param("id", uuid);

    //     restMockMvc.perform(requestBuilder).andExpect(status().isOk());
    // }
}
