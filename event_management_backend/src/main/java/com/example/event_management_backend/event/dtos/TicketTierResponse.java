package com.example.event_management_backend.event.dtos;


import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class TicketTierResponse {

    private UUID id;
    private String name;
    private BigDecimal price;
    private String description;

    private Integer seatsAvailable;
    private Integer totalSeats;

    private List<String> features;
}


