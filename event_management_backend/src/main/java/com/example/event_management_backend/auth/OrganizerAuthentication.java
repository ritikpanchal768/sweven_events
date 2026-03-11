package com.example.event_management_backend.auth;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public class OrganizerAuthentication
        extends AbstractAuthenticationToken {

    private final OrganizerPrincipal principal;

    // 🔥 AUTHENTICATED constructor
    public OrganizerAuthentication(
            OrganizerPrincipal principal) {

        super(List.of(
                new SimpleGrantedAuthority(
                        "ROLE_" + principal.getRole()
                )
        ));

        this.principal = principal;

        // safer than setAuthenticated(true)
        super.setAuthenticated(true);
    }

    // 🔥 OPTIONAL — unauthenticated version
    public OrganizerAuthentication() {
        super(List.of());
        this.principal = null;
        super.setAuthenticated(false);
    }

    @Override
    public Object getCredentials() {
        return null; // JWT system → no credentials stored
    }

    @Override
    public OrganizerPrincipal getPrincipal() {
        return principal;
    }
}
