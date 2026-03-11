package com.example.event_management_backend.Social.services;

import com.example.event_management_backend.Social.DTO.InstagramPost;
import com.example.event_management_backend.Social.repository.InstagramPostRepository;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.util.UUID;


@Service
public class InstagramPostService {


    private final InstagramPostRepository instagramPostRepository;

    public InstagramPostService( InstagramPostRepository instagramPostRepository) {
        this.instagramPostRepository = instagramPostRepository;
    }

    private static final String TABLE_NAME = "instagramposts";



    // ===============================
    // ADD POST
    // ===============================

    public void add(String url) throws Exception {

        if (url == null || !url.contains("instagram.com/p/")) {
            throw new IllegalArgumentException("Invalid Instagram URL");
        }

        InstagramPost post = new InstagramPost();
        post.setId(UUID.randomUUID());
        post.setUrl(url);
        post.setDisplayOrder(0);
        post.setCreatedAt(Instant.now());

        instagramPostRepository.saveObject(post);
    }




}
