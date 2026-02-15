package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
class HelloControllerTest {

    @Autowired
    private HelloController controller;

    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }

    @Test
    void indexShouldReturnGreetingMessage() {
        String result = controller.index();
        assertThat(result).isEqualTo("Greetings from Spring Boot!");
    }

    @Test
    void indexShouldNotReturnNull() {
        String result = controller.index();
        assertThat(result).isNotNull();
    }

    @Test
    void indexShouldNotBeEmpty() {
        String result = controller.index();
        assertThat(result).isNotEmpty();
    }
}
