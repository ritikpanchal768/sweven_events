package com.example.event_management_backend.auth.services;

import com.example.event_management_backend.auth.dtos.OrganizerSession;
import com.example.event_management_backend.db.DbUtils;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
public class DbSessionService {

    private final DbUtils db;

    public DbSessionService(DbUtils db) {
        this.db = db;
    }

    public void create(UUID sessionId, UUID organizerId, Instant expiresAt)
            throws Exception {

        db.saveObject(
                new OrganizerSession(
                        sessionId,
                        organizerId,
                        expiresAt,
                        false
                ),
                "organizersession"
        );
    }

    public OrganizerSession findValid(UUID sessionId) throws Exception {

        String sql = """
            SELECT *
            FROM organizersession
            WHERE sessionid = ?
              AND revoked = false
              AND expiresat > now()
        """;

        return db.returnedAsObject(sql, OrganizerSession.class, sessionId);
    }

    public void revoke(UUID sessionId) throws Exception {

        String sql = """
            UPDATE organizersession
            SET revoked = true
            WHERE sessionid = ?
        """;

        db.updateObject(
                Map.of("revoked", true),
                "organizersession",
                sessionId
        );
    }
}
