package com.example.event_management_backend.event.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleRequest {

    private String time;
    private String title;
    private String description;
    private String speaker;
    private Integer orderIndex;
}
