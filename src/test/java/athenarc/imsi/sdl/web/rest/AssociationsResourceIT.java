package athenarc.imsi.sdl.web.rest;

import athenarc.imsi.sdl.SpOtApp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
/**
 * Test class for the AssociationsResource REST controller.
 *
 * @see AssociationsResource
 */
@SpringBootTest(classes = SpOtApp.class)
public class AssociationsResourceIT {

    private MockMvc restMockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        AssociationsResource associationsResource = new AssociationsResource();
        restMockMvc = MockMvcBuilders
            .standaloneSetup(associationsResource)
            .build();
    }

    /**
     * Test submit
     */
    @Test
    public void testSubmit() throws Exception {
        restMockMvc.perform(post("/api/associations/submit"))
            .andExpect(status().isOk());
    }
}
