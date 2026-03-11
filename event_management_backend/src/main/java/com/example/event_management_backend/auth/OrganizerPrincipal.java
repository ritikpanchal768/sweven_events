package com.example.event_management_backend.auth;

import java.security.Principal;
import java.util.UUID;

public class OrganizerPrincipal {

    private UUID id;
    private String email;
    private String role;

    public OrganizerPrincipal(
            UUID id,
            String email,
            String role) {

        this.id = id;
        this.email = email;
        this.role = role;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
