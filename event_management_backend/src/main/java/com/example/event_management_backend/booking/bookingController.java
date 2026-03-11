package com.example.event_management_backend.booking;

import com.example.event_management_backend.booking.dto.Booking;
import com.example.event_management_backend.booking.request.BookingRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("v1/booking")
public class bookingController {
    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

    public bookingController(BookingService bookingService, BookingRepository bookingRepository) {
        this.bookingService = bookingService;
        this.bookingRepository = bookingRepository;
    }

    @PostMapping("/requestBooking")
    public ResponseEntity<?> requestBooking(@RequestBody BookingRequestDto request) throws Exception {

        Booking booking = bookingService.createPendingBooking(request);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/admin/event/{eventId}/pendingBookings")
    public List<Booking> getPendingBookings(@PathVariable UUID eventId) throws Exception {
        return bookingRepository.getPendingBookings(eventId);
    }

    @PutMapping("/admin/booking/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable UUID id) throws Exception {
        bookingService.approveBooking(id);
        return ResponseEntity.ok("Approved");
    }

    @PutMapping("/admin/booking/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable UUID id) throws Exception {

        bookingService.rejectBooking(id);

        return ResponseEntity.ok("Rejected");
    }

}
