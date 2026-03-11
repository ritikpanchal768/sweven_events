package com.example.event_management_backend.booking.request;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class BookingRequestDto {

    private UUID eventId;
    private UUID tierId;
    private Integer quantity;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
}
