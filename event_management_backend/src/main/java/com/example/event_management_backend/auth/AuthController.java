package com.example.event_management_backend.auth;

import com.example.event_management_backend.auth.request.LoginRequest;
import com.example.event_management_backend.auth.response.AuthResponse;
import com.example.event_management_backend.auth.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("v1/auth/organizer")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) throws Exception {

        return ResponseEntity.ok(service.login(request));
    }

//    @PostMapping("/refresh")
//    public ResponseEntity<AuthResponse> refresh(
//            @RequestBody Map<String, String> body) throws Exception {
//        return ResponseEntity.ok(
//                service.refresh(body.get("refreshToken"))
//        );
//    }

    @PostMapping("/v1/auth/logout")
    public void logout(
            @RequestHeader("Authorization") String header
    ) throws Exception {

        String token = header.substring(7);
        service.logout(token);
    }

}

