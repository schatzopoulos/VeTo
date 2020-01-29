package athenarc.imsi.sdl.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AssociationsResource controller
 */
@RestController
@RequestMapping("/api/associations")
public class AssociationsResource {

    private final Logger log = LoggerFactory.getLogger(AssociationsResource.class);

    /**
    * POST submit
    */
    @PostMapping("/submit")
    public String submit() {
        return "submit";
    }

     /**
    * GET status
    */
    @GetMapping("/status")
    public String status() {
        return "status";
    }

}
