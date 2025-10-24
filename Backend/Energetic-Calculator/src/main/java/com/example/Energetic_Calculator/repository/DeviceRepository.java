package com.example.Energetic_Calculator.repository;

import com.example.Energetic_Calculator.model.Device;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Repository
public class DeviceRepository {

    private static final String COLLECTION_NAME = "devices";

    public String saveDevice(Device device) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        if (device.getId() == null || device.getId().isEmpty()) {
            device.setId(UUID.randomUUID().toString());
        }

        ApiFuture<WriteResult> result = db.collection(COLLECTION_NAME)
                .document(device.getId())
                .set(device);

        return result.get().getUpdateTime().toString();
    }

    public Device getDeviceById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentSnapshot document = db.collection(COLLECTION_NAME).document(id).get().get();
        if (document.exists()) {
            return document.toObject(Device.class);
        } else {
            return null;
        }
    }

    public List<Device> getAllDevices() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        List<QueryDocumentSnapshot> documents = db.collection(COLLECTION_NAME).get().get().getDocuments();
        List<Device> devices = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            devices.add(doc.toObject(Device.class));
        }
        return devices;
    }

    public String deleteDevice(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = db.collection(COLLECTION_NAME).document(id).delete();
        return writeResult.get().getUpdateTime().toString();
    }
}