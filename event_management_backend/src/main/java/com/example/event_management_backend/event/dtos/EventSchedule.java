package com.example.event_management_backend.event.dtos;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventSchedule {

    private UUID id;

    private UUID eventId;

    private String time;

    private String title;

    private String description;

    private String speaker;

    private Integer orderIndex;

    private Instant createdAt;

    private Instant updatedAt;
}

