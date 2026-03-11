package com.example.event_management_backend.event.requests;

import java.math.BigDecimal;
import java.util.List;

public class TicketTierRequest {
    private String name;
    private BigDecimal price;
    private String description;
    private Integer totalTierSeats;
    private List<String> features;

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public Integer getTotalTierSeats() {
        return totalTierSeats;
    }

    public void setTotalTierSeats(Integer totalTierSeats) {
        this.totalTierSeats = totalTierSeats;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
