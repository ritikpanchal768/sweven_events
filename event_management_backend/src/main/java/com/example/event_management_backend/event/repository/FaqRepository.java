package com.example.event_management_backend.event.repository;

import com.example.event_management_backend.db.DbUtils;
import com.example.event_management_backend.event.dtos.EventFaq;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class FaqRepository {

    private final DbUtils dbUtils;

    public FaqRepository(DbUtils dbUtils) {
        this.dbUtils = dbUtils;
    }


    public void save(EventFaq faq) throws Exception {
        dbUtils.saveObject(faq,"eventfaq");
    }

    public List<EventFaq> findByEventId(UUID eventId) throws Exception {

        String sql = "SELECT * FROM eventfaq WHERE eventId = ?";

        return dbUtils.returnedAsList(sql, EventFaq.class, eventId);
    }
}

