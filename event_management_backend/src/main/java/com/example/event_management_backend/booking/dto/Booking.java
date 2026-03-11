package com.example.event_management_backend.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class Booking {

    private UUID id;
    private UUID eventid;
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private UUID tierid;
    private Integer quantity;
    private BigDecimal totalamount;
    private String status;
    private LocalDateTime createdat;

    public Booking() {
    }

    public Booking(UUID id,
                   UUID eventid,
                   String firstname,
                   String lastname,
                   String email,
                   String phone,
                   UUID tierid,
                   Integer quantity,
                   BigDecimal totalamount,
                   String status,
                   LocalDateTime createdat) {
        this.id = id;
        this.eventid = eventid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.tierid = tierid;
        this.quantity = quantity;
        this.totalamount = totalamount;
        this.status = status;
        this.createdat = createdat;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getEventid() {
        return eventid;
    }

    public void setEventid(UUID eventid) {
        this.eventid = eventid;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UUID getTierid() {
        return tierid;
    }

    public void setTierid(UUID tierid) {
        this.tierid = tierid;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getTotalamount() {
        return totalamount;
    }

    public void setTotalamount(BigDecimal totalamount) {
        this.totalamount = totalamount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedat() {
        return createdat;
    }

    public void setCreatedat(LocalDateTime createdat) {
        this.createdat = createdat;
    }
}
