package com.example.event_management_backend.auth.dtos;

import java.time.Instant;
import java.util.UUID;

public class OrganizerSession {

    private UUID sessionId;
    private UUID organizerId;
    private Instant expiresAt;
    private Boolean revoked;
    private Instant createdAt;

    // REQUIRED: Empty constructor for reflection
    public OrganizerSession() {}

    public OrganizerSession(
            UUID sessionId,
            UUID organizerId,
            Instant expiresAt,
            Boolean revoked
    ) {
        this.sessionId = sessionId;
        this.organizerId = organizerId;
        this.expiresAt = expiresAt;
        this.revoked = revoked;
        this.createdAt = Instant.now();
    }

    // Getters & Setters


    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }

    public UUID getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(UUID organizerId) {
        this.organizerId = organizerId;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Boolean getRevoked() {
        return revoked;
    }

    public void setRevoked(Boolean revoked) {
        this.revoked = revoked;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
