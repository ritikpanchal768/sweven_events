package com.example.event_management_backend.event.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventSpeaker {

    private UUID id;
    private UUID eventId;
    private String name;
    private String title;
    private String bio;
    private String image;
}
