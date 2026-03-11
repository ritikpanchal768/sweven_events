package com.example.event_management_backend.event.dtos;

import lombok.Data;
import java.util.UUID;

@Data
public class ScheduleResponse {
    private UUID id;
    private String time;
    private String title;
    private String description;
    private String speaker;
    private Integer orderIndex;
}

