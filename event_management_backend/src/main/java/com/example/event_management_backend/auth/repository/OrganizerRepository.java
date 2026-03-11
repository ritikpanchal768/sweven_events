package com.example.event_management_backend.auth.repository;

import com.example.event_management_backend.auth.dtos.Organizer;
import com.example.event_management_backend.db.DbUtils;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class OrganizerRepository {

    private final DbUtils db;

    public OrganizerRepository(DbUtils db) {
        this.db = db;
    }

    // ✅ FIND BY EMAIL (login)
    public Organizer findByEmail(String email) throws Exception {

        String sql = """
            SELECT *
            FROM organizer
            WHERE email = ?
        """;

        return db.returnedAsObject(
                sql,
                Organizer.class,
                email
        );
    }

    // 🔥 ADD THIS
    public Organizer findById(UUID id) throws Exception {

        String sql = """
            SELECT *
            FROM organizer
            WHERE id = ?
        """;

        return db.returnedAsObject(
                sql,
                Organizer.class,
                id
        );
    }
}

