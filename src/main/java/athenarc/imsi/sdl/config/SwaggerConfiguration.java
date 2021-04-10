package athenarc.imsi.sdl.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
@Import(BeanValidatorPluginsConfiguration.class)
public class SwaggerConfiguration {

    @Primary
    @Bean
    public Docket swaggerSpringfoxApiDocket() {
        String groupName = "default";
        return new Docket(DocumentationType.SWAGGER_2)
	    .apiInfo(apiInfo())
            .select()
            .apis(RequestHandlerSelectors.basePackage("athenarc.imsi.sdl.web.rest"))
            .paths(PathSelectors.ant("/api/**"))
            .build()
            .useDefaultResponseMessages(false)
            .groupName(groupName);
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder().title("SciNeM REST API")
            .description("REST API used for accessing stored datasets and submitting analyses").build();
    }
}
