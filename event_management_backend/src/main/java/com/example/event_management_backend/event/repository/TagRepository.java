package com.example.event_management_backend.event.repository;

import com.example.event_management_backend.db.DbUtils;
import com.example.event_management_backend.event.dtos.EventTag;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class TagRepository {
    private final DbUtils dbUtils;


    public TagRepository(DbUtils dbUtils) {
        this.dbUtils = dbUtils;
    }
    public List<EventTag> getTagByEventId(UUID id) throws Exception{
        String query = "Select * From eventTag where eventid = ?";
        return dbUtils.returnedAsList(query, EventTag.class, id);
    }
}
