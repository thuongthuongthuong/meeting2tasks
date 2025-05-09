package com.meeting2tasks.schedulingservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Scheduling Service API")
                        .version("1.0.0")
                        .description("API documentation for Scheduling Service in Meeting2Tasks application"));
    }
}