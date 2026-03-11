package com.example.event_management_backend.event;

import com.example.event_management_backend.auth.dtos.Organizer;
import com.example.event_management_backend.auth.repository.OrganizerRepository;
import com.example.event_management_backend.event.dtos.*;
import com.example.event_management_backend.event.repository.*;
import com.example.event_management_backend.event.requests.*;
import com.example.event_management_backend.utils.CommonUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import static com.example.event_management_backend.utils.CommonUtils.copyNonNullFields;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final TicketTierRepository ticketTierRepository;
    private final TagRepository tagRepository;
    private final OrganizerRepository organizerRepository;
    private final ScheduleRepository scheduleRepository;
    private final SpeakerRepository speakerRepository;
    private final FaqRepository faqRepository;
    private final CommonUtils commonUtils;

    public EventService(
            EventRepository eventRepository,
            TicketTierRepository ticketTierRepository, TagRepository tagRepository, OrganizerRepository organizerRepository, ScheduleRepository scheduleRepository, SpeakerRepository speakerRepository, FaqRepository faqRepository, CommonUtils commonUtils
    ) {
        this.eventRepository = eventRepository;
        this.ticketTierRepository = ticketTierRepository;
        this.tagRepository = tagRepository;
        this.organizerRepository = organizerRepository;
        this.scheduleRepository = scheduleRepository;
        this.speakerRepository = speakerRepository;
        this.faqRepository = faqRepository;
        this.commonUtils = commonUtils;
    }

    @Transactional
    public void createEvent(
            CreateEventRequest request,
            UUID organizerId
    ) throws Exception {

        UUID eventId = UUID.randomUUID();

        // ✅ CREATE EVENT DTO
        Event event = new Event();

        event.setId(eventId);
        event.setOrganizerId(organizerId);
        event.setTitle(request.getTitle());
        event.setSubtitle(request.getSubtitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());

        event.setDate(request.getDate());
        event.setEndDate(request.getEndDate());

        event.setVenueName(request.getVenue().getName());
        event.setVenueAddress(request.getVenue().getAddress());
        event.setVenueCity(request.getVenue().getCity());
        event.setVenueState(request.getVenue().getState());
        event.setVenueZipCode(request.getVenue().getZipCode());

        event.setTotalSeats(request.getTotalSeats());

        if(request.getVenue().getCoordinates()== null || request.getVenue().getCoordinates().getLat() == null){
            event.setLatitude((double) 0);
            event.setLongitude((double) 0);
        }else {
            event.setLatitude(request.getVenue().getCoordinates().getLat());
            event.setLongitude(request.getVenue().getCoordinates().getLng());
        }





        event.setFeatured(request.getIsFeatured());
        event.setStatus(request.getStatus());

        event.setCreatedAt(Instant.now());
        event.setUpdatedAt(Instant.now());
        event.setBannerImage(request.getBannerImageUrl());
        event.setApproveRequired(request.getApprovalRequired());

        // ✅ SAVE EVENT
        eventRepository.save(event);

        if (request.getSchedule() != null && !request.getSchedule().isEmpty()) {

            List<EventSchedule> schedules = request.getSchedule()
                    .stream()
                    .map(s -> EventSchedule.builder()
                            .id(UUID.randomUUID())
                            .eventId(eventId)
                            .time(s.getTime())
                            .title(s.getTitle())
                            .description(s.getDescription())
                            .speaker(s.getSpeaker())
                            .orderIndex(s.getOrderIndex())
                            .createdAt(Instant.now())
                            .updatedAt(Instant.now())
                            .build())
                    .toList();

            scheduleRepository.saveBatch(schedules);
        }

        // =========================
        // TIERS
        // =========================

        for (TicketTierRequest tierRequest : request.getTicketTiers()) {

            UUID tierId = UUID.randomUUID();

            TicketTier tier = new TicketTier();

            tier.setId(tierId);
            tier.setEventId(eventId);
            tier.setName(tierRequest.getName());
            tier.setPrice(tierRequest.getPrice());
            tier.setDescription(tierRequest.getDescription());
            tier.setTotalTierSeats(tierRequest.getTotalTierSeats());

            // VERY IMPORTANT
            tier.setAvailableSeats(tierRequest.getTotalTierSeats());

            tier.setCreatedAt(Instant.now());

            ticketTierRepository.save(tier);

            // FEATURES
            if (tierRequest.getFeatures() != null) {

                for (String feature : tierRequest.getFeatures()) {

                    TicketTierFeature f =
                            new TicketTierFeature();

                    f.setId(UUID.randomUUID());
                    f.setTierId(tierId);
                    f.setFeature(feature);

                    ticketTierRepository.saveFeature(f);
                }
            }
        }

        // =========================
        // TAGS
        // =========================

        if (request.getTags() != null) {

            for (String tag : request.getTags()) {

                EventTag eventTag = new EventTag();

                eventTag.setId(UUID.randomUUID());
                eventTag.setEventId(eventId);
                eventTag.setTag(tag);

                eventRepository.saveTag(eventTag);
            }
        }

        // Save Speakers
        if (request.getSpeakers() != null) {
            for (SpeakerRequest s : request.getSpeakers()) {

                EventSpeaker speaker = new EventSpeaker(
                        UUID.randomUUID(),
                        eventId,
                        s.getName(),
                        s.getTitle(),
                        s.getBio(),
                        s.getImage()
                );

                speakerRepository.save(speaker);
            }
        }

// Save FAQs
        if (request.getFaqs() != null) {
            for (FaqRequest f : request.getFaqs()) {

                EventFaq faq = new EventFaq(
                        null,
                        eventId,
                        f.getQuestion(),
                        f.getAnswer()
                );

                faqRepository.save(faq);
            }
        }
    }

    public EventResponse getFeaturedEvent() throws Exception {

        Event event = eventRepository.findFeaturedEvent();

        if (event == null) {
            throw new RuntimeException("No featured event found");
        }

        List<TicketTier> tiers = ticketTierRepository.findByEventId(event.getId());
        List<EventSchedule> schedules = scheduleRepository.findByEventId(event.getId());

        return mapToResponse(event, tiers, schedules);
    }

    public List<EventResponse> getAllUpcomingEvents() throws Exception{
        List<Event> events = eventRepository.getAllEvents();
        List<EventResponse> eventResponses = new ArrayList<>();

        for(Event event : events){
            EventResponse response = new EventResponse();
            List<TicketTier> tiers = ticketTierRepository.findByEventId(event.getId());
            List<EventSchedule> schedules = scheduleRepository.findByEventId(event.getId());

            response  = mapToResponse(event,tiers,schedules);
            eventResponses.add(response);
        }
        return eventResponses;
    }


    public EventResponse mapToResponse(Event event,List<TicketTier> tiers, List<EventSchedule> schedules)throws Exception {

        EventResponse response = new EventResponse();

        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setSubtitle(event.getSubtitle());
        response.setDescription(event.getDescription());
        response.setCategory(event.getCategory());

        response.setDate(event.getDate());
        response.setEndDate(event.getEndDate());
        response.setTime(String.valueOf(event.getDate()));

        response.setVenue(event.getVenueName());
        response.setCity(event.getVenueCity());
        response.setAddress(event.getVenueAddress());

        response.setImage(event.getBannerImage());
        response.setBannerImage(event.getBannerImage());

        response.setTotalSeats(event.getTotalSeats());
        response.setSeatsLeft(event.getTotalSeats());

        response.setIsFeatured(event.getFeatured());
        response.setApprovalRequired(event.getApproveRequired());

        List<EventTag> eventTag = tagRepository.getTagByEventId(event.getId());
        response.setTags(eventTag == null ?
                List.of() :
                        eventTag
                        .stream()
                        .map(EventTag::getTag)
                        .toList());

        // Organizer
        OrganizerResponse organizer = new OrganizerResponse();
        Organizer admin = organizerRepository.findById(event.getOrganizerId());
        organizer.setName("Sweven Events (hard code)");
        organizer.setLogo("logo hard code");
        response.setOrganizer(organizer);
        String venueMap = "https://www.google.com/maps?q="
                + event.getLatitude() + ","
                + event.getLongitude();
        response.setVenueMap(venueMap);

        // Map ticket tiers
        response.setTicketTiers(
                tiers.stream().map(tier -> {
                    TicketTierResponse tr = new TicketTierResponse();
                    tr.setId(tier.getId());
                    tr.setName(tier.getName());
                    tr.setPrice(tier.getPrice());
                    tr.setDescription(tier.getDescription());
                    tr.setSeatsAvailable(tier.getAvailableSeats());
                    tr.setTotalSeats(tier.getTotalTierSeats());
                    List<TicketTierFeature> ticketTierFeatures = null;
                    try {
                        ticketTierFeatures = ticketTierRepository.getFeatureByTierId(tier.getId());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    tr.setFeatures(ticketTierFeatures == null ?
                            List.of() :
                            ticketTierFeatures
                                    .stream()
                                    .map(TicketTierFeature::getFeature)
                                    .toList());
                    return tr;
                }).toList()
        );

        response.setSchedule(
                schedules == null
                        ? List.of()
                        : schedules.stream()
                        .sorted(Comparator.comparing(EventSchedule::getOrderIndex))
                        .map(schedule -> {
                            ScheduleResponse sr = new ScheduleResponse();
                            sr.setId(schedule.getId());
                            sr.setTime(schedule.getTime());
                            sr.setTitle(schedule.getTitle());
                            sr.setDescription(schedule.getDescription());
                            sr.setSpeaker(schedule.getSpeaker());
                            sr.setOrderIndex(schedule.getOrderIndex());
                            return sr;
                        })
                        .toList()
        );

        List<EventSpeaker> speakers =
                speakerRepository.findByEventId(event.getId());

        response.setSpeakers(
                speakers.stream().map(s -> {
                    SpeakerResponse sr = new SpeakerResponse();
                    sr.setId(s.getId());
                    sr.setName(s.getName());
                    sr.setTitle(s.getTitle());
                    sr.setBio(s.getBio());
                    sr.setImage(s.getImage());
                    return sr;
                }).toList()
        );

        List<EventFaq> faqs = faqRepository.findByEventId(event.getId());
        response.setFaqs(
                faqs == null ? List.of() :
                        faqs.stream().map(f -> {
                            FaqResponse fr = new FaqResponse();
                            fr.setQuestion(f.getQuestion());
                            fr.setAnswer(f.getAnswer());
                            return fr;
                        }).toList()
        );

        return response;
    }



}
