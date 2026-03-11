package com.example.event_management_backend.auth.services;

import com.example.event_management_backend.auth.dtos.RefreshToken;
import com.example.event_management_backend.db.DbUtils;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final DbUtils db;

    public RefreshTokenService(DbUtils db) {
        this.db = db;
    }

    // 🔥 Generate secure token (NOT UUID)
    public String generateSecureToken() throws Exception {

        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[64];
        random.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    // 🔥 SHA-256 hash
    public String hashToken(String token) throws Exception {

        MessageDigest digest =
                MessageDigest.getInstance("SHA-256");

        byte[] hash = digest.digest(token.getBytes());

        return Base64.getEncoder()
                .encodeToString(hash);
    }

    // ✅ CREATE REFRESH TOKEN
    public String create(
            UUID organizerId,
            String device,
            String ip
    ) throws Exception {

        String rawToken = generateSecureToken();
        String hash = hashToken(rawToken);

        RefreshToken token = new RefreshToken(
                UUID.randomUUID(),
                organizerId,
                hash,
                Instant.now().plus(Duration.ofDays(7)),
                false,
                device,
                ip
        );

        db.saveObject(token, "refreshToken");

        return rawToken; // return ONLY raw token
    }

    // ✅ FIND VALID TOKEN
    public RefreshToken findValid(String rawToken)
            throws Exception {

        String hash = hashToken(rawToken);

        String sql = """
            SELECT *
            FROM refreshToken
            WHERE tokenHash = ?
              AND revoked = false
              AND expiresAt > now()
        """;

        return db.returnedAsObject(
                sql,
                RefreshToken.class,
                hash
        );
    }

    // ✅ REVOKE
    public void revoke(UUID tokenId) throws Exception {

        String sql = """
            UPDATE refreshToken
            SET revoked = true
            WHERE tokenId = ?
        """;

        db.updateObject(
                Map.of("revoked", true),
                "refreshToken",
                tokenId
        );
    }
}

