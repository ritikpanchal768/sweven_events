package com.example.event_management_backend.Social;

import com.example.event_management_backend.Social.DTO.InstagramPost;
import com.example.event_management_backend.Social.Request.InstagramReorderRequest;
import com.example.event_management_backend.Social.repository.InstagramPostRepository;
import com.example.event_management_backend.Social.services.InstagramPostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/social/instagram")
@CrossOrigin(origins = "*")
public class InstagramPostController {

    private final InstagramPostService service;
    private final InstagramPostRepository repository;

    public InstagramPostController(InstagramPostService service, InstagramPostRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping("/getAllPost")
    public List<InstagramPost> getAll() throws Exception {
        return repository.getAll();
    }

    @PostMapping("/addPost")
    public void add(@RequestBody InstagramPost request) throws Exception {
        service.add(request.getUrl());
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable UUID id) throws Exception {
        repository.delete(id);
    }

    @PutMapping("/reorder")
    public ResponseEntity<?> reorderPosts(
            @RequestBody List<InstagramReorderRequest> reorderList
    ) throws Exception {

        repository.reorderPosts(reorderList);

        return ResponseEntity.ok("Reordered successfully");
    }

}
