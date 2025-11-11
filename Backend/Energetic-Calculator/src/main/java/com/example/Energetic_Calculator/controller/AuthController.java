    }
package com.example.Energetic_Calculator.controller;

import com.example.Energetic_Calculator.service.FirebaseAuthService;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")

public class AuthController {

    private final FirebaseAuthService authService;

    public AuthController(FirebaseAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            String displayName = request.get("displayName");
            String uid = authService.registerUser(email, password, displayName);
            return ResponseEntity.ok(Map.of("uid", uid, "message", "User registered successfully"));
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            Map<String, Object> response = authService.loginUser(email, password);
            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String, String> request) {
        try {
            String idToken = request.get("idToken");
            Map<String, Object> response = authService.verifyToken(idToken);
            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, String> request) {
        try {
            String uid = request.get("uid");
            String displayName = request.get("displayName");
            String email = request.get("email");
            authService.updateUser(uid, displayName, email);
            return ResponseEntity.ok(Map.of("message", "User updated successfully"));
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestBody Map<String, String> request) {
        try {
            String uid = request.get("uid");
            authService.deleteUser(uid);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}