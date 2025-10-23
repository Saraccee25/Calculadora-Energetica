package com.example.Energetic_Calculator.controller;

import com.example.Energetic_Calculator.service.FirebaseFirestoreService;
import com.example.Energetic_Calculator.service.FirebaseRealtimeDatabaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")
public class DataController {

    private final FirebaseFirestoreService firestoreService;
    private final FirebaseRealtimeDatabaseService realtimeService;

    public DataController(FirebaseFirestoreService firestoreService, FirebaseRealtimeDatabaseService realtimeService) {
        this.firestoreService = firestoreService;
        this.realtimeService = realtimeService;
    }

    // Firestore endpoints
    @PostMapping("/firestore/{collection}")
    public ResponseEntity<?> createFirestoreDocument(@PathVariable String collection, @RequestBody Map<String, Object> data) {
        try {
            String id = firestoreService.createDocument(collection, data);
            return ResponseEntity.ok(Map.of("id", id, "message", "Document created"));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/firestore/{collection}/{id}")
    public ResponseEntity<?> getFirestoreDocument(@PathVariable String collection, @PathVariable String id) {
        try {
            Map<String, Object> data = firestoreService.getDocument(collection, id);
            if (data != null) {
                return ResponseEntity.ok(data);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/firestore/{collection}")
    public ResponseEntity<?> getAllFirestoreDocuments(@PathVariable String collection) {
        try {
            List<Map<String, Object>> data = firestoreService.getAllDocuments(collection);
            return ResponseEntity.ok(data);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/firestore/{collection}/{id}")
    public ResponseEntity<?> updateFirestoreDocument(@PathVariable String collection, @PathVariable String id, @RequestBody Map<String, Object> data) {
        try {
            firestoreService.updateDocument(collection, id, data);
            return ResponseEntity.ok(Map.of("message", "Document updated"));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/firestore/{collection}/{id}")
    public ResponseEntity<?> deleteFirestoreDocument(@PathVariable String collection, @PathVariable String id) {
        try {
            firestoreService.deleteDocument(collection, id);
            return ResponseEntity.ok(Map.of("message", "Document deleted"));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Realtime Database endpoints
    @PostMapping("/realtime/{path}")
    public ResponseEntity<?> createRealtimeData(@PathVariable String path, @RequestBody Map<String, Object> data) {
        try {
            String result = realtimeService.createOrUpdateData(path, data);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/realtime/{path}")
    public ResponseEntity<?> getRealtimeData(@PathVariable String path) {
        try {
            Map<String, Object> data = realtimeService.getData(path);
            if (data != null) {
                return ResponseEntity.ok(data);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/realtime/{path}")
    public ResponseEntity<?> deleteRealtimeData(@PathVariable String path) {
        try {
            String result = realtimeService.deleteData(path);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}