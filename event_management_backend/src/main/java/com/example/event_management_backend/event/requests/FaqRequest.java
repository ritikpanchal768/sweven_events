package com.example.event_management_backend.event.requests;

import lombok.Data;

@Data
public class FaqRequest {
    private String question;
    private String answer;
}

