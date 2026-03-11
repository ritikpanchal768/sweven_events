package com.example.event_management_backend.booking.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class BookingResponseDto {
    private UUID id;
    private BigDecimal totalAmount;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
