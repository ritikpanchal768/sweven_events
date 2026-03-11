package com.example.event_management_backend.booking;

import com.example.event_management_backend.booking.dto.Booking;
import com.example.event_management_backend.booking.request.BookingRequestDto;
import com.example.event_management_backend.db.DbUtils;
import com.example.event_management_backend.event.dtos.TicketTier;
import com.example.event_management_backend.event.dtos.TicketTierFeature;
import com.example.event_management_backend.event.repository.TicketTierRepository;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {
    private final DbUtils dbUtils;
    private final TicketTierRepository ticketTierRepository;
    private final BookingRepository bookingRepository;

    public BookingService(DbUtils dbUtils, TicketTierRepository ticketTierRepository, BookingRepository bookingRepository) {
        this.dbUtils = dbUtils;
        this.ticketTierRepository = ticketTierRepository;
        this.bookingRepository = bookingRepository;
    }

    public Booking createPendingBooking(BookingRequestDto request) throws Exception {

        Booking booking = new Booking();
        UUID bookingId = UUID.randomUUID();

        BigDecimal totalAmount = calculateTotal(request.getTierId(), request.getQuantity());

        booking.setId(bookingId);
        booking.setCreatedat(LocalDateTime.now());
        booking.setStatus("PENDING_APPROVAL");
        booking.setEmail(request.getEmail());
        booking.setEventid(request.getEventId());
        booking.setFirstname(request.getFirstName());
        booking.setLastname(request.getLastName());
        booking.setPhone(request.getPhone());
        booking.setTierid(request.getTierId());
        booking.setQuantity(request.getQuantity());
        booking.setTotalamount(totalAmount);


        dbUtils.saveObject(booking,"booking");
        return booking;
    }

    public void approveBooking(UUID bookingId) throws Exception {

        Booking booking = bookingRepository.getBookingById(bookingId);
        booking.setStatus("APPROVED_WATING_PAYMENT");
        dbUtils.updateObject( booking,"booking", bookingId);

        reduceSeats(bookingId);
    }
    public void rejectBooking(UUID bookingId) throws Exception {

        Booking booking = bookingRepository.getBookingById(bookingId);
        booking.setStatus("REJECTED");
        dbUtils.updateObject(booking,"booking", bookingId);
    }

    public BigDecimal calculateTotal(UUID tierId, Integer quantity) throws Exception {
       TicketTier ticketTier =  ticketTierRepository.getTierByTierId(tierId);
       return ticketTier.getPrice().multiply(BigDecimal.valueOf(quantity));
    }

    public void reduceSeats(UUID bookingId){

    }
}
