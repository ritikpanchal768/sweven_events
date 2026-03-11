package com.example.event_management_backend.event.dtos;


import java.time.Instant;
import java.util.List;
import java.util.UUID;

import lombok.Data;


@Data
public class EventResponse {

    private UUID id;
    private String title;
    private String subtitle;
    private String description;
    private String category;

    private Instant date;
    private Instant endDate;
    private String time;

    private String venue;
    private String city;
    private String address;

    private String image;
    private String bannerImage;

    private List<TicketTierResponse> ticketTiers;

    private List<SpeakerResponse> speakers;
    private List<ScheduleResponse> schedule;

    private Integer totalSeats;
    private Integer seatsLeft;

    private Boolean isFeatured;

    private List<String> tags;

    private OrganizerResponse organizer;

    private String venueMap;

    private List<FaqResponse> faqs;

    private boolean approvalRequired;

}
