package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class DemoApplicationTests {

    @Autowired
    private ApplicationContext context;

    @Autowired
    private HelloController helloController;

    @Test
    void contextLoads() {
        // Verify that the application context loads successfully
        assertThat(context).isNotNull();
    }

    @Test
    void helloControllerLoads() {
        assertThat(helloController).isNotNull();
    }

    @Test
    void helloControllerReturnsCorrectMessage() {
        String result = helloController.index();
        assertThat(result).isEqualTo("Greetings from Spring Boot!");
    }

    @Test
    void applicationContextContainsHelloController() {
        assertThat(context.containsBean("helloController")).isTrue();
    }

    @Test
    void helloControllerMessageIsNotEmpty() {
        String result = helloController.index();
        assertThat(result).isNotEmpty();
        assertThat(result).contains("Spring Boot");
    }
}
