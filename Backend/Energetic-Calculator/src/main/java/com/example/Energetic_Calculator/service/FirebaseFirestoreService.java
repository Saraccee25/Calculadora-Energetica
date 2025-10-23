package com.example.Energetic_Calculator.service;

import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseFirestoreService {

    public String createDocument(String collection, Map<String, Object> data) throws ExecutionException, InterruptedException {
        var firestore = FirestoreClient.getFirestore();
        var docRef = firestore.collection(collection).document();
        var result = docRef.set(data).get();
        return docRef.getId();
    }

    public Map<String, Object> getDocument(String collection, String documentId) throws ExecutionException, InterruptedException {
        var firestore = FirestoreClient.getFirestore();
        var docRef = firestore.collection(collection).document(documentId);
        var document = docRef.get().get();
        if (document.exists()) {
            return document.getData();
        } else {
            return null;
        }
    }

    public List<Map<String, Object>> getAllDocuments(String collection) throws ExecutionException, InterruptedException {
        var firestore = FirestoreClient.getFirestore();
        var future = firestore.collection(collection).get();
        var querySnapshot = future.get();
        return querySnapshot.getDocuments().stream().map(doc -> {
            Map<String, Object> data = new HashMap<>(doc.getData());
            data.put("id", doc.getId());
            return data;
        }).toList();
    }

    public void updateDocument(String collection, String documentId, Map<String, Object> data) throws ExecutionException, InterruptedException {
        var firestore = FirestoreClient.getFirestore();
        var docRef = firestore.collection(collection).document(documentId);
        docRef.update(data).get();
    }

    public void deleteDocument(String collection, String documentId) throws ExecutionException, InterruptedException {
        var firestore = FirestoreClient.getFirestore();
        var docRef = firestore.collection(collection).document(documentId);
        docRef.delete().get();
    }
}