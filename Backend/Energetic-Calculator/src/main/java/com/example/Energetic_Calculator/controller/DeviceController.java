package com.example.Energetic_Calculator.controller;

import com.example.Energetic_Calculator.model.Device;
import com.example.Energetic_Calculator.service.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "*")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }


    @PostMapping
    public ResponseEntity<?> createDevice(@RequestBody Device device) throws ExecutionException, InterruptedException {


        if (device.getNombre() == null || device.getNombre().length() < 3 || device.getNombre().length() > 50) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ El nombre debe tener entre 3 y 50 caracteres."));
        }

        List<String> categoriasValidas = List.of("Cocina", "Lavandería", "Clima", "Entretenimiento", "Iluminación", "Otros");
        if (!categoriasValidas.contains(device.getCategoria())) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ La categoría debe ser una de: " + categoriasValidas));
        }

        if (device.getPotenciaWatts() < 1 || device.getPotenciaWatts() > 5000) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ La potencia debe estar entre 1 y 5000 watts."));
        }

        if (device.getHorasUsoDiario() < 0.1 || device.getHorasUsoDiario() > 24.0) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ Las horas de uso diario deben estar entre 0.1 y 24."));
        }

        if (device.getDiasUsoMensual() < 1 || device.getDiasUsoMensual() > 31) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ Los días de uso mensual deben estar entre 1 y 31."));
        }


        String result = deviceService.addDevice(device);
        return ResponseEntity.ok(Map.of("message", "✅ Dispositivo registrado con éxito", "timestamp", result));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getDevice(@PathVariable String id) throws ExecutionException, InterruptedException {
        Device device = deviceService.getDevice(id);

        if (device == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "⚠️ No se encontró ningún dispositivo con el ID: " + id));
        }

        return ResponseEntity.ok(device);
    }


    @GetMapping
    public ResponseEntity<?> getAllDevices() throws ExecutionException, InterruptedException {
        List<Device> devices = deviceService.listDevices();

        if (devices.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "ℹ️ No hay dispositivos registrados actualmente."));
        }

        return ResponseEntity.ok(devices);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDevice(@PathVariable String id) throws ExecutionException, InterruptedException {
        Device device = deviceService.getDevice(id);

        if (device == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "⚠️ No se puede eliminar. No existe un dispositivo con el ID: " + id));
        }

        String result = deviceService.deleteDevice(id);
        return ResponseEntity.ok(Map.of("message", "🗑️ Dispositivo eliminado con éxito", "timestamp", result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDevice(@PathVariable String id, @RequestBody Device updatedDevice)
            throws ExecutionException, InterruptedException {

        Device existingDevice = deviceService.getDevice(id);
        if (existingDevice == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "⚠️ No se puede actualizar. No existe un dispositivo con el ID: " + id));
        }


        if (updatedDevice.getNombre() == null || updatedDevice.getNombre().length() < 3 || updatedDevice.getNombre().length() > 50) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ El nombre debe tener entre 3 y 50 caracteres."));
        }

        List<String> categoriasValidas = List.of("Cocina", "Lavandería", "Clima", "Entretenimiento", "Iluminación", "Otros");
        if (!categoriasValidas.contains(updatedDevice.getCategoria())) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ La categoría debe ser una de: " + categoriasValidas));
        }

        if (updatedDevice.getPotenciaWatts() < 1 || updatedDevice.getPotenciaWatts() > 5000) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ La potencia debe estar entre 1 y 5000 watts."));
        }

        if (updatedDevice.getHorasUsoDiario() < 0.1 || updatedDevice.getHorasUsoDiario() > 24.0) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ Las horas de uso diario deben estar entre 0.1 y 24."));
        }

        if (updatedDevice.getDiasUsoMensual() < 1 || updatedDevice.getDiasUsoMensual() > 31) {
            return ResponseEntity.badRequest().body(Map.of("error", "❌ Los días de uso mensual deben estar entre 1 y 31."));
        }

        updatedDevice.setId(id);

        String result = deviceService.updateDevice(updatedDevice);
        return ResponseEntity.ok(Map.of("message", "🔄 Dispositivo actualizado con éxito", "timestamp", result));
    }

}
