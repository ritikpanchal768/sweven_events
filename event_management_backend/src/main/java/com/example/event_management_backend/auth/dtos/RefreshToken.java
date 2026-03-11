package com.example.event_management_backend.auth.dtos;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

public class RefreshToken {

    private UUID tokenId;
    private UUID organizerId;
    private String tokenHash;
    private Instant expiresAt;
    private Boolean revoked;
    private Instant createdAt;
    private String deviceInfo;
    private String ipAddress;

    public RefreshToken() {}

    public RefreshToken(
            UUID tokenId,
            UUID organizerId,
            String tokenHash,
            Instant expiresAt,
            Boolean revoked,
            String deviceInfo,
            String ipAddress
    ) {
        this.tokenId = tokenId;
        this.organizerId = organizerId;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
        this.revoked = revoked;
        this.createdAt = Instant.now();
        this.deviceInfo = deviceInfo;
        this.ipAddress = ipAddress;
    }

    // getters & setters omitted for brevity
}
