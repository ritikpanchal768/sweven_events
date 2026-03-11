package com.example.event_management_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class EventManagementBackendApplication {

	public static void main(String[] args) {

        SpringApplication.run(EventManagementBackendApplication.class, args);

	}

}
