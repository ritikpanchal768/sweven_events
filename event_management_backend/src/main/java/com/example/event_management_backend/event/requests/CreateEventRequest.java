package com.example.event_management_backend.event.requests;

import java.time.Instant;
import java.util.List;

public class CreateEventRequest {

    private String title;
    private String subtitle;
    private String description;
    private String category;
    private Instant date;
    private Instant endDate;
    private VenueRequest venue;
    private Integer totalSeats;
    private List<TicketTierRequest> ticketTiers;
    private List<String> tags;
    private Boolean isFeatured;
    private String status;
    private String bannerImageUrl;
    private List<ScheduleRequest> schedule;
    private List<SpeakerRequest> speakers;
    private List<FaqRequest> faqs;
    private Boolean approvalRequired;




    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public VenueRequest getVenue() {
        return venue;
    }

    public void setVenue(VenueRequest venue) {
        this.venue = venue;
    }

    public List<TicketTierRequest> getTicketTiers() {
        return ticketTiers;
    }

    public void setTicketTiers(List<TicketTierRequest> ticketTiers) {
        this.ticketTiers = ticketTiers;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Boolean getFeatured() {
        return isFeatured;
    }

    public void setFeatured(Boolean featured) {
        isFeatured = featured;
    }

    public String getBannerImageUrl() {
        return bannerImageUrl;
    }

    public void setBannerImageUrl(String bannerImageUrl) {
        this.bannerImageUrl = bannerImageUrl;
    }

    public List<ScheduleRequest> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<ScheduleRequest> schedule) {
        this.schedule = schedule;
    }

    public List<SpeakerRequest> getSpeakers() {
        return speakers;
    }

    public void setSpeakers(List<SpeakerRequest> speakers) {
        this.speakers = speakers;
    }

    public List<FaqRequest> getFaqs() {
        return faqs;
    }

    public void setFaqs(List<FaqRequest> faqs) {
        this.faqs = faqs;
    }

    public Boolean getApprovalRequired() {
        return approvalRequired;
    }

    public void setApprovalRequired(Boolean approvalRequired) {
        this.approvalRequired = approvalRequired;
    }
}
