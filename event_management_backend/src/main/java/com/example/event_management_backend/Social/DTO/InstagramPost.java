package com.example.event_management_backend.Social.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;


@AllArgsConstructor
@Builder
public class InstagramPost {

    private UUID id;
    private String url;
    private Integer displayOrder;
    private Instant createdAt;

    public InstagramPost() {}

    public InstagramPost(String url) {
        this.id = UUID.randomUUID();
        this.url = url;
        this.displayOrder = 0;
        this.createdAt = Instant.now();
    }

    // Getters & Setters

    public UUID getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}