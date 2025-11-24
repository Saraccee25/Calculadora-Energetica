package com.example.Energetic_Calculator.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.Energetic_Calculator.model.UserDevice;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

@Service
public class UserDeviceService {

    private static final String COLLECTION_NAME = "user_devices";
    private final FirebaseFirestoreService firestoreService;

    public UserDeviceService(FirebaseFirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    /**
     * Obtiene todos los dispositivos de un usuario específico
     */
    public List<UserDevice> getUserDevices(String userId) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        var query = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", userId)
                .get();
        
        var querySnapshot = query.get();
        
        return querySnapshot.getDocuments().stream()
                .map(doc -> {
                    UserDevice device = doc.toObject(UserDevice.class);
                    device.setId(doc.getId());
                    return device;
                })
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo dispositivo para un usuario
     */
    public UserDevice createUserDevice(UserDevice userDevice) throws ExecutionException, InterruptedException {
        // Validaciones
        if (userDevice.getUserId() == null || userDevice.getUserId().isEmpty()) {
            throw new IllegalArgumentException("El userId es requerido");
        }
        if (userDevice.getDeviceId() == null || userDevice.getDeviceId().isEmpty()) {
            throw new IllegalArgumentException("El deviceId es requerido");
        }
        if (userDevice.getQuantity() < 1 || userDevice.getQuantity() > 10) {
            throw new IllegalArgumentException("La cantidad debe estar entre 1 y 10");
        }
        if (userDevice.getDailyHours() < 0.1 || userDevice.getDailyHours() > 24) {
            throw new IllegalArgumentException("Las horas diarias deben estar entre 0.1 y 24");
        }
        if (userDevice.getWeeklyDays() < 1 || userDevice.getWeeklyDays() > 7) {
            throw new IllegalArgumentException("Los días semanales deben estar entre 1 y 7");
        }

        // Establecer fecha de creación
        userDevice.setCreatedAt(new Date());

        // Convertir a Map para guardar en Firestore
        Map<String, Object> data = new HashMap<>();
        data.put("userId", userDevice.getUserId());
        data.put("deviceId", userDevice.getDeviceId());
        data.put("quantity", userDevice.getQuantity());
        data.put("dailyHours", userDevice.getDailyHours());
        data.put("weeklyDays", userDevice.getWeeklyDays());
        data.put("createdAt", userDevice.getCreatedAt());

        // Crear documento en Firestore
        String documentId = firestoreService.createDocument(COLLECTION_NAME, data);
        userDevice.setId(documentId);

        return userDevice;
    }

    /**
     * Elimina un dispositivo verificando que pertenezca al usuario
     */
    public boolean deleteUserDevice(String deviceId, String userId) throws ExecutionException, InterruptedException {
        // Obtener el documento
        Map<String, Object> data = firestoreService.getDocument(COLLECTION_NAME, deviceId);
        
        if (data == null) {
            return false; // El dispositivo no existe
        }

        // Verificar que pertenezca al usuario
        String docUserId = (String) data.get("userId");
        if (!userId.equals(docUserId)) {
            throw new SecurityException("No tienes permisos para eliminar este dispositivo");
        }

        // Eliminar el documento
        firestoreService.deleteDocument(COLLECTION_NAME, deviceId);
        return true;
    }

    /**
     * Obtiene un dispositivo específico (con validación de propiedad)
     */
    public UserDevice getUserDevice(String deviceId, String userId) throws ExecutionException, InterruptedException {
        Map<String, Object> data = firestoreService.getDocument(COLLECTION_NAME, deviceId);
        
        if (data == null) {
            return null;
        }

        // Verificar que pertenezca al usuario
        String docUserId = (String) data.get("userId");
        if (!userId.equals(docUserId)) {
            throw new SecurityException("No tienes permisos para acceder a este dispositivo");
        }

        // Convertir a UserDevice
        UserDevice device = new UserDevice();
        device.setId(deviceId);
        device.setUserId((String) data.get("userId"));
        device.setDeviceId((String) data.get("deviceId"));
        device.setQuantity(((Long) data.get("quantity")).intValue());
        device.setDailyHours(((Double) data.get("dailyHours")).floatValue());
        device.setWeeklyDays(((Long) data.get("weeklyDays")).intValue());
        
        if (data.get("createdAt") != null) {
            device.setCreatedAt((Date) data.get("createdAt"));
        }

        return device;
    }
}

