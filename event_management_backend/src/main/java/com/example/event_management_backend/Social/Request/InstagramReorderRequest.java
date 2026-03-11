package com.example.event_management_backend.Social.Request;

import java.util.UUID;

public class InstagramReorderRequest {
    private UUID id;
    private Integer displayOrder;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
