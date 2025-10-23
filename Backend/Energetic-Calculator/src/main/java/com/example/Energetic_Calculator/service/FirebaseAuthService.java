package com.example.Energetic_Calculator.service;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.stereotype.Service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.CreateRequest;
import com.google.firebase.auth.UserRecord.UpdateRequest;

@Service
public class FirebaseAuthService {

    private static final Logger logger = Logger.getLogger(FirebaseAuthService.class.getName());
    private final FirebaseAuth firebaseAuth;

    public FirebaseAuthService(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    public String registerUser(String email, String password, String displayName) throws FirebaseAuthException {
        logger.info("Registering user with email: " + email);
        CreateRequest request = new CreateRequest()
                .setEmail(email)
                .setPassword(password)
                .setDisplayName(displayName)
                .setEmailVerified(false);

        UserRecord userRecord = firebaseAuth.createUser(request);
        logger.info("User registered successfully with UID: " + userRecord.getUid());
        return userRecord.getUid();
    }

    public Map<String, Object> loginUser(String email, String password) throws FirebaseAuthException {
        // Note: Firebase Admin SDK doesn't handle password login directly.
        // This is typically handled on the client-side. For backend, we can verify tokens.
        // For simplicity, assuming client sends ID token after login.
        // In a real scenario, implement token verification here.
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful. Please send ID token for verification.");
        return response;
    }

    public Map<String, Object> verifyToken(String idToken) throws FirebaseAuthException {
        var decodedToken = firebaseAuth.verifyIdToken(idToken);
        Map<String, Object> response = new HashMap<>();
        response.put("uid", decodedToken.getUid());
        response.put("email", decodedToken.getEmail());
        response.put("name", decodedToken.getName());
        return response;
    }

    public void updateUser(String uid, String displayName, String email) throws FirebaseAuthException {
        UpdateRequest request = new UpdateRequest(uid)
                .setDisplayName(displayName)
                .setEmail(email);

        firebaseAuth.updateUser(request);
    }

    public void deleteUser(String uid) throws FirebaseAuthException {
        firebaseAuth.deleteUser(uid);
    }
}