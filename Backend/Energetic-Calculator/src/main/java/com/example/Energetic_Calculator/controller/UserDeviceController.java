package com.example.Energetic_Calculator.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Energetic_Calculator.model.UserDevice;
import com.example.Energetic_Calculator.service.UserDeviceService;
import com.google.firebase.auth.FirebaseToken;

@RestController
@RequestMapping("/api/user-devices")
@CrossOrigin(origins = "*")
public class UserDeviceController {

    private final UserDeviceService userDeviceService;

    public UserDeviceController(UserDeviceService userDeviceService) {
        this.userDeviceService = userDeviceService;
    }

    /**
     * Extrae el UID del usuario autenticado desde el contexto de seguridad
     */
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof FirebaseToken) {
            FirebaseToken token = (FirebaseToken) authentication.getPrincipal();
            return token.getUid();
        }
        return null;
    }

    /**
     * GET /api/user-devices - Obtiene todos los dispositivos del usuario autenticado
     */
    @GetMapping
    public ResponseEntity<?> getUserDevices() {
        try {
            String userId = getAuthenticatedUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Usuario no autenticado"));
            }

            List<UserDevice> devices = userDeviceService.getUserDevices(userId);
            return ResponseEntity.ok(devices);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener dispositivos: " + e.getMessage()));
        }
    }

    /**
     * POST /api/user-devices - Crea un nuevo dispositivo para el usuario autenticado
     */
    @PostMapping
    public ResponseEntity<?> createUserDevice(@RequestBody UserDevice userDevice) {
        try {
            String userId = getAuthenticatedUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Usuario no autenticado"));
            }

            // Establecer el userId del usuario autenticado
            userDevice.setUserId(userId);

            UserDevice createdDevice = userDeviceService.createUserDevice(userDevice);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDevice);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al crear dispositivo: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/user-devices/{id} - Elimina un dispositivo del usuario autenticado
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserDevice(@PathVariable String id) {
        try {
            String userId = getAuthenticatedUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Usuario no autenticado"));
            }

            boolean deleted = userDeviceService.deleteUserDevice(id, userId);
            
            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Dispositivo no encontrado"));
            }

            return ResponseEntity.ok(Map.of("message", "Dispositivo eliminado exitosamente"));

        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar dispositivo: " + e.getMessage()));
        }
    }

    /**
     * GET /api/user-devices/{id} - Obtiene un dispositivo específico del usuario autenticado
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserDevice(@PathVariable String id) {
        try {
            String userId = getAuthenticatedUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Usuario no autenticado"));
            }

            UserDevice device = userDeviceService.getUserDevice(id, userId);
            
            if (device == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Dispositivo no encontrado"));
            }

            return ResponseEntity.ok(device);

        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener dispositivo: " + e.getMessage()));
        }
    }
}

