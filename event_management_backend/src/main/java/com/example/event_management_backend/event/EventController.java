package com.example.event_management_backend.event;

import com.example.event_management_backend.auth.OrganizerPrincipal;
import com.example.event_management_backend.event.dtos.Event;
import com.example.event_management_backend.event.dtos.EventResponse;
import com.example.event_management_backend.event.repository.EventRepository;
import com.example.event_management_backend.event.requests.CreateEventRequest;
import com.example.event_management_backend.utils.FileStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("v1/event")
public class EventController {

    private final EventService eventService;
    private final FileStorageService fileStorageService;
    private final EventRepository eventRepository;

    public EventController(EventService eventService, FileStorageService fileStorageService, ObjectMapper objectMapper, EventRepository eventRepository) {
        this.eventService = eventService;
        this.fileStorageService = fileStorageService;
        this.eventRepository = eventRepository;
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createEvent(
            @RequestPart("event") CreateEventRequest request,
            @RequestPart("bannerImage") MultipartFile bannerImage,
            @AuthenticationPrincipal OrganizerPrincipal principal
    ) throws Exception {

        String imageUrl = fileStorageService.saveFile(bannerImage);
        request.setBannerImageUrl(imageUrl);

        eventService.createEvent(request, principal==null? UUID.fromString("b6bb1e72-bb54-42a3-a9b9-27b28e2d5173") : principal.getId());

        return ResponseEntity.ok("Event Created");
    }




    @GetMapping("/featured")
    public ResponseEntity<EventResponse> getFeaturedEvent()throws Exception {
        EventResponse response = eventService.getFeaturedEvent();
        return ResponseEntity.ok(response);
    }




    @GetMapping("/all")
    public List<Event> getAllEvents() throws Exception {
        return eventRepository.getAllEvents();
    }

    @GetMapping("/upcoming")
    public List<EventResponse> getUpcomingEvents() throws Exception {
        return eventService.getAllUpcomingEvents();
    }

}
