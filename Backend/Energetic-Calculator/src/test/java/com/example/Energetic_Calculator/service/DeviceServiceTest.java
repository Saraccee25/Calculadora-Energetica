package com.example.Energetic_Calculator.service;

import com.example.Energetic_Calculator.model.Device;
import com.example.Energetic_Calculator.repository.DeviceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeviceServiceTest {

    @Mock
    private DeviceRepository deviceRepository;

    @InjectMocks
    private DeviceService deviceService;

    private Device sampleDevice;

    @BeforeEach
    void setup() {
        sampleDevice = new Device();
        sampleDevice.setId("1");
        sampleDevice.setNombre("Lampara");
    }

    @Test
    void addDevice_success_returnsRepositoryResult() throws ExecutionException, InterruptedException {
        when(deviceRepository.saveDevice(sampleDevice)).thenReturn("OK");

        String result = deviceService.addDevice(sampleDevice);

        assertEquals("OK", result);
        verify(deviceRepository, times(1)).saveDevice(sampleDevice);
    }

    @Test
    void getDevice_success_returnsDevice() throws ExecutionException, InterruptedException {
        when(deviceRepository.getDeviceById("1")).thenReturn(sampleDevice);

        Device result = deviceService.getDevice("1");

        assertNotNull(result);
        assertEquals("1", result.getId());
        verify(deviceRepository, times(1)).getDeviceById("1");
    }

    @Test
    void listDevices_success_returnsList() throws ExecutionException, InterruptedException {
        Device d2 = new Device();
        d2.setId("2");
        d2.setNombre("Ventilador");

        when(deviceRepository.getAllDevices()).thenReturn(Arrays.asList(sampleDevice, d2));

        List<Device> result = deviceService.listDevices();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(deviceRepository, times(1)).getAllDevices();
    }

    @Test
    void deleteDevice_success_returnsMessage() throws ExecutionException, InterruptedException {
        when(deviceRepository.deleteDevice("1")).thenReturn("Deleted");

        String result = deviceService.deleteDevice("1");

        assertEquals("Deleted", result);
        verify(deviceRepository, times(1)).deleteDevice("1");
    }

    @Test
    void updateDevice_callsSaveDevice() throws ExecutionException, InterruptedException {
        when(deviceRepository.saveDevice(sampleDevice)).thenReturn("Updated");

        String result = deviceService.updateDevice(sampleDevice);

        assertEquals("Updated", result);
        verify(deviceRepository, times(1)).saveDevice(sampleDevice);
    }


    @Test
    void addDevice_repositoryThrowsExecutionException_propagates() throws ExecutionException, InterruptedException {
        when(deviceRepository.saveDevice(sampleDevice)).thenThrow(new ExecutionException(new RuntimeException("fail")));

        assertThrows(ExecutionException.class, () -> deviceService.addDevice(sampleDevice));
        verify(deviceRepository, times(1)).saveDevice(sampleDevice);
    }

    @Test
    void getDevice_repositoryThrowsInterruptedException_propagates() throws ExecutionException, InterruptedException {
        when(deviceRepository.getDeviceById("1")).thenThrow(new InterruptedException("interrupted"));

        assertThrows(InterruptedException.class, () -> deviceService.getDevice("1"));
        verify(deviceRepository, times(1)).getDeviceById("1");
    }
}