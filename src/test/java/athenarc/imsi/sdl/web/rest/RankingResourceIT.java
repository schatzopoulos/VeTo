package athenarc.imsi.sdl.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import athenarc.imsi.sdl.SpOtApp;
/**
 * Test class for the RankingResource REST controller.
 *
 * @see DatasetsResource
 */
@SpringBootTest(classes = SpOtApp.class)
public class RankingResourceIT {

    private MockMvc restMockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        DatasetsResource rankingResource = new DatasetsResource();
        restMockMvc = MockMvcBuilders
            .standaloneSetup(rankingResource)
            .build();
    }

    /**
     * Test submit
     */
    @Test
    public void testSubmit() throws Exception {
        restMockMvc.perform(post("/api/ranking/submit")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{ \"metapath\": \"APA\", \"constraints\": { \"P\": \"year > 2015\" }, \"folder\": \"DBLP\" }"))    
        .andExpect(status().isOk());
    }

    /**
     * Test status
     */
    @Test
    public void testStatus() throws Exception {
        MvcResult result = restMockMvc.perform(post("/api/ranking/submit")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{ \"metapath\": \"APA\", \"constraints\": { \"P\": \"year > 2015\" }, \"folder\": \"DBLP\" }")) 
        .andExpect(status().isOk()).andReturn();
        String content = result.getResponse().getContentAsString();
        Document response = Document.parse(content);
        String uuid = response.getString("id");

        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get("/api/ranking/get");
        requestBuilder.param("id", uuid);

        restMockMvc.perform(requestBuilder).andExpect(status().isOk());
    }
}
