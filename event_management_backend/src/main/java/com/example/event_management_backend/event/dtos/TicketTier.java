package com.example.event_management_backend.event.dtos;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class TicketTier {

    private UUID id;
    private UUID eventId;

    private String name;
    private BigDecimal price;
    private String description;

    private Integer totalTierSeats;
    private Integer availableSeats;

    private Instant createdAt;

    public TicketTier() {
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getTotalTierSeats() {
        return totalTierSeats;
    }

    public void setTotalTierSeats(Integer totalTierSeats) {
        this.totalTierSeats = totalTierSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
