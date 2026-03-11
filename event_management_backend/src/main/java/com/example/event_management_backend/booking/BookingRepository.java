package com.example.event_management_backend.booking;

import com.example.event_management_backend.booking.dto.Booking;
import com.example.event_management_backend.db.DbUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class BookingRepository {

    private final DbUtils dbUtils;

    public BookingRepository(DbUtils dbUtils) {
        this.dbUtils = dbUtils;
    }

    public List<Booking> getPendingBookings(UUID eventId) throws Exception {

        String sql = """
        SELECT * FROM booking
        WHERE eventid = ?
        AND status = 'PENDING_APPROVAL'
        ORDER BY createdat DESC
    """;

        return dbUtils.returnedAsList(sql,Booking.class,eventId);
    }
    public Booking getBookingById(UUID bookingId) throws Exception {

        String sql = """
        SELECT * FROM booking
        WHERE id = ?
        AND status = 'PENDING_APPROVAL'
        ORDER BY createdat DESC
    """;

        return dbUtils.returnedAsObject(sql,Booking.class,bookingId);
    }

}
