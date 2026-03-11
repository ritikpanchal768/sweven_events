package com.example.event_management_backend.event.requests;

import lombok.Data;

@Data
public class SpeakerRequest {
    private String name;
    private String title;
    private String bio;
    private String image;
}

