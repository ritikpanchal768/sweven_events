package com.example.event_management_backend.auth.dtos;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

public class Organizer {

    private UUID id;
    private String email;
    private String password;
    private String role;
    private Boolean enabled;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // ✅ REQUIRED — no-args constructor for reflection
    public Organizer() {
    }

    public Organizer(
            UUID id,
            String email,
            String password,
            String role,
            Boolean enabled,
            Timestamp createdAt,
            Timestamp updatedAt
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ✅ Getters & Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    // ⚠️ Do NOT expose password in APIs later
    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
