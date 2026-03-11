package com.example.event_management_backend.event.repository;

import com.example.event_management_backend.db.DbUtils;
import com.example.event_management_backend.event.dtos.Event;
import com.example.event_management_backend.event.dtos.EventTag;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EventRepository {
    private final DbUtils dbUtils;

    public EventRepository(DbUtils dbUtils) {
        this.dbUtils = dbUtils;
    }

    public void save(Event event) throws Exception {
        dbUtils.saveObject(event, "event");
    }

    public void saveTag(EventTag tag) throws Exception {
        dbUtils.saveObject(tag, "eventTag");
    }

    public Event findFeaturedEvent() throws Exception {

        String sql = """
            SELECT * FROM event
            WHERE isFeatured = true
            AND status = 'published'
            ORDER BY date ASC
            LIMIT 1
        """;

        return dbUtils.returnedAsObject(sql, Event.class);
    }
    public List<Event> getAllEvents() throws Exception {

        String sql = """
            SELECT * FROM event
            WHERE status = 'published' 
            ORDER BY date DESC
        """;

        return dbUtils.returnedAsList(sql, Event.class);
    }


}
