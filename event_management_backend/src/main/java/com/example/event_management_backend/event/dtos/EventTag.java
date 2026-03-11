package com.example.event_management_backend.event.dtos;

import java.util.UUID;

public class EventTag {

    private UUID id;
    private UUID eventId;
    private String tag;

    public EventTag() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}
