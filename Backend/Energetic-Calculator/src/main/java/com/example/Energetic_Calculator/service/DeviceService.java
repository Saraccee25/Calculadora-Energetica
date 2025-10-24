package com.example.Energetic_Calculator.service;

import com.example.Energetic_Calculator.model.Device;
import com.example.Energetic_Calculator.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public String addDevice(Device device) throws ExecutionException, InterruptedException {
        return deviceRepository.saveDevice(device);
    }

    public Device getDevice(String id) throws ExecutionException, InterruptedException {
        return deviceRepository.getDeviceById(id);
    }

    public List<Device> listDevices() throws ExecutionException, InterruptedException {
        return deviceRepository.getAllDevices();
    }

    public String deleteDevice(String id) throws ExecutionException, InterruptedException {
        return deviceRepository.deleteDevice(id);
    }

    public String updateDevice(Device device) throws ExecutionException, InterruptedException {
        return deviceRepository.saveDevice(device);
    }

}

