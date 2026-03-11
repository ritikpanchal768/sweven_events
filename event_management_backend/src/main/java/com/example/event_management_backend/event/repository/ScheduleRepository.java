package com.example.event_management_backend.event.repository;

import com.example.event_management_backend.db.DbUtils;
import com.example.event_management_backend.event.dtos.EventSchedule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ScheduleRepository {
    private final DbUtils dbUtils;

    private static final String TABLE_NAME = "eventschedule";

    public void saveBatch(List<EventSchedule> schedules) throws Exception {

        if (schedules == null || schedules.isEmpty()) return;

        for (EventSchedule schedule : schedules) {

            dbUtils.saveObject(schedule, TABLE_NAME);
        }
    }

    public List<EventSchedule> findByEventId(UUID eventId) throws Exception {

        String sql = """
            SELECT *
            FROM eventschedule
            WHERE eventId = ?
            ORDER BY orderIndex ASC
        """;

        return dbUtils.returnedAsList(
                sql,
                EventSchedule.class,
                eventId
        );
    }
}
