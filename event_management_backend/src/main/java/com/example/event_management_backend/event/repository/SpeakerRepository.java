package com.example.event_management_backend.event.repository;

import com.example.event_management_backend.db.DbUtils;
import com.example.event_management_backend.event.dtos.EventSpeaker;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class SpeakerRepository {

    private final DbUtils dbUtils;

    public SpeakerRepository(DbUtils dbUtils) {
        this.dbUtils = dbUtils;
    }

    public void save(EventSpeaker speaker) throws Exception {
        dbUtils.saveObject(speaker,"eventspeaker");
    }

    public List<EventSpeaker> findByEventId(UUID eventId) throws Exception {

        String sql = "SELECT * FROM eventspeaker WHERE eventId = ?";

        return dbUtils.returnedAsList(sql,EventSpeaker.class,eventId);
    }
}

