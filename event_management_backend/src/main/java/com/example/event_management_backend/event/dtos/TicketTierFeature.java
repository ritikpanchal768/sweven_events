package com.example.event_management_backend.event.dtos;

import java.util.UUID;

public class TicketTierFeature {

    private UUID id;
    private UUID tierId;
    private String feature;

    public TicketTierFeature() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTierId() {
        return tierId;
    }

    public void setTierId(UUID tierId) {
        this.tierId = tierId;
    }

    public String getFeature() {
        return feature;
    }

    public void setFeature(String feature) {
        this.feature = feature;
    }
}
