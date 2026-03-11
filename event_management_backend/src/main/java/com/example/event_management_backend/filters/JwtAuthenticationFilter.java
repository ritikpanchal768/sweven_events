package com.example.event_management_backend.filters;

import com.example.event_management_backend.auth.*;
import com.example.event_management_backend.auth.dtos.Organizer;
import com.example.event_management_backend.auth.dtos.OrganizerSession;
import com.example.event_management_backend.auth.repository.OrganizerRepository;
import com.example.event_management_backend.auth.services.DbSessionService;
import com.example.event_management_backend.auth.services.JwtService;
import com.example.event_management_backend.auth.services.RedisSessionService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwt;
    private final RedisSessionService redis;
    private final DbSessionService db;
    private final OrganizerRepository organizerRepo;

    public JwtAuthenticationFilter(
            JwtService jwt,
            RedisSessionService redis,
            DbSessionService db,
            OrganizerRepository organizerRepo
    ) {
        this.jwt = jwt;
        this.redis = redis;
        this.db = db;
        this.organizerRepo = organizerRepo;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain)
            throws IOException, ServletException {

        if(true){
            chain.doFilter(req, res);
            return;
        }
        String header = req.getHeader("Authorization");
        String path = req.getRequestURI();

        if (path.contains("/uploads/")) {
            chain.doFilter(req, res);
            return;
        }

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        try {

            String token = header.substring(7);

            UUID sessionId =
                    jwt.extractSessionId(token);

            // ✅ FAST PATH — Redis
            UUID organizerId =
                    redis.get(sessionId);

            // ✅ FALLBACK — DB
            if (organizerId == null) {

                OrganizerSession session =
                        db.findValid(sessionId);

                if (session == null) {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }

                redis.store(
                        sessionId,
                        session.getOrganizerId(),
                        Duration.between(
                                Instant.now(),
                                session.getExpiresAt()
                        ).toMillis()
                );

                organizerId =
                        session.getOrganizerId();
            }

            // 🔥 LOAD ORGANIZER (CRITICAL)
            Organizer organizer =
                    organizerRepo.findById(organizerId);

            if (organizer == null) {
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            OrganizerPrincipal principal =
                    new OrganizerPrincipal(
                            organizer.getId(),
                            organizer.getEmail(),
                            organizer.getRole()
                    );

            OrganizerAuthentication authentication =
                    new OrganizerAuthentication(principal);

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

        } catch (Exception e) {

            SecurityContextHolder.clearContext();

            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        chain.doFilter(req, res);
    }
}
