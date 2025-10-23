package com.example.Energetic_Calculator.config;

import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FirebaseAuthException.class)
    public ResponseEntity<Map<String, String>> handleFirebaseAuthException(FirebaseAuthException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication failed: " + e.getMessage()));
    }

    @ExceptionHandler(ExecutionException.class)
    public ResponseEntity<Map<String, String>> handleExecutionException(ExecutionException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Database operation failed: " + e.getMessage()));
    }

    @ExceptionHandler(InterruptedException.class)
    public ResponseEntity<Map<String, String>> handleInterruptedException(InterruptedException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Operation interrupted: " + e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
    }
}