package com.example.event_management_backend.auth.services;

import com.example.event_management_backend.auth.dtos.Organizer;
import com.example.event_management_backend.auth.repository.OrganizerRepository;
import com.example.event_management_backend.auth.request.LoginRequest;
import com.example.event_management_backend.auth.response.AuthResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final OrganizerRepository organizerRepo;
    private final DbSessionService dbSessionService;
    private final RedisSessionService redisSessionService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            OrganizerRepository organizerRepo,
            DbSessionService dbSessionService,
            RedisSessionService redisSessionService,
            RefreshTokenService refreshTokenService
    ) {
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.organizerRepo = organizerRepo;
        this.dbSessionService = dbSessionService;
        this.redisSessionService = redisSessionService;
        this.refreshTokenService = refreshTokenService;
    }

    /**
     * LOGIN
     */
    public AuthResponse login(LoginRequest request)
            throws Exception {

        // ✅ Normalize email (VERY IMPORTANT)
        String email = request.getEmail()
                .toLowerCase()
                .trim();

        Organizer organizer =
                organizerRepo.findByEmail(email);

        // ✅ Never reveal what failed
        if (organizer == null ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        organizer.getPassword())) {

            throw new RuntimeException("Invalid credentials");
        }

        // 🔥 Optional but recommended later
        // if (!organizer.isEnabled()) {
        //     throw new RuntimeException("Account disabled");
        // }

        String accessToken =
                createSession(organizer.getId());

        String refreshToken =
                refreshTokenService.create(
                        organizer.getId(),
                        request.getDevice(),
                        request.getIpAddress()
                );

        return new AuthResponse(
                accessToken,
                refreshToken
        );
    }

    /**
     * SESSION CREATION
     * Reusable for refresh / OAuth later
     */
    private String createSession(UUID organizerId)
            throws Exception {

        UUID sessionId = UUID.randomUUID();

        Instant now = Instant.now();

        Instant expiresAt =
                now.plusSeconds(15 * 60 * 60); // 15 minutes

        long ttlMillis =
                Duration.between(now, expiresAt)
                        .toMillis();

        // ✅ DB = source of truth
        dbSessionService.create(
                sessionId,
                organizerId,
                expiresAt
        );

        // ✅ Redis = fast lookup
        redisSessionService.store(
                sessionId,
                organizerId,
                ttlMillis
        );

        // ✅ JWT contains sessionId
        return jwtService.generateToken(
                organizerId,
                sessionId
        );
    }

    /**
     * LOGOUT
     */
    public void logout(String token)
            throws Exception {

        UUID sessionId =
                jwtService.extractSessionId(token);

        // delete from Redis first
        redisSessionService.delete(sessionId);

        // revoke in DB
        dbSessionService.revoke(sessionId);
    }
}
