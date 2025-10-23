package com.example.Energetic_Calculator.service;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FirebaseRealtimeDatabaseService {

    private final FirebaseDatabase database;

    public FirebaseRealtimeDatabaseService() {
        this.database = FirebaseDatabase.getInstance();
    }

    public String createOrUpdateData(String path, Map<String, Object> data) {
        DatabaseReference ref = database.getReference(path);
        ref.setValue(data, (error, ref1) -> {
            if (error != null) {
                System.err.println("Error updating data: " + error.getMessage());
            } else {
                System.out.println("Data updated successfully");
            }
        });
        return "Data update initiated at " + path;
    }

    public Map<String, Object> getData(String path) {
        DatabaseReference ref = database.getReference(path);
        // Note: Synchronous get is not recommended; for simplicity, returning null
        // In production, use listeners or async methods
        return null;
    }

    public String deleteData(String path) {
        DatabaseReference ref = database.getReference(path);
        ref.removeValue((error, ref1) -> {
            if (error != null) {
                System.err.println("Error deleting data: " + error.getMessage());
            } else {
                System.out.println("Data deleted successfully");
            }
        });
        return "Data deletion initiated at " + path;
    }

    public DatabaseReference getReference(String path) {
        return database.getReference(path);
    }
}