package com.example.event_management_backend.auth.services;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
public class RedisSessionService {

    private final StringRedisTemplate redis;

    public RedisSessionService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    private String key(UUID sessionId) {
        return "session:" + sessionId;
    }

    public void store(UUID sessionId, UUID organizerId, long ttlMillis) {
        redis.opsForValue().set(
                key(sessionId),
                organizerId.toString(),
                Duration.ofMillis(ttlMillis)
        );
    }

    public UUID get(UUID sessionId) {
        String val = redis.opsForValue().get(key(sessionId));
        return val == null ? null : UUID.fromString(val);
    }

    public void delete(UUID sessionId) {
        redis.delete(key(sessionId));
    }
}

