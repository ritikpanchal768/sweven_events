package com.example.event_management_backend.event.dtos;

import lombok.Data;
import java.util.UUID;

@Data
public class SpeakerResponse {
    private UUID id;
    private String name;
    private String title;
    private String bio;
    private String image;
}

