package com.example.Energetic_Calculator.model;

import java.util.Date;

public class UserDevice {

    private String id;
    private String userId;
    private String deviceId;
    private int quantity;
    private float dailyHours;
    private int weeklyDays;
    private Date createdAt;

    public UserDevice() {
        this.createdAt = new Date();
    }

    public UserDevice(String id, String userId, String deviceId, int quantity, float dailyHours, int weeklyDays) {
        this.id = id;
        this.userId = userId;
        this.deviceId = deviceId;
        this.quantity = quantity;
        this.dailyHours = dailyHours;
        this.weeklyDays = weeklyDays;
        this.createdAt = new Date();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public float getDailyHours() {
        return dailyHours;
    }

    public void setDailyHours(float dailyHours) {
        this.dailyHours = dailyHours;
    }

    public int getWeeklyDays() {
        return weeklyDays;
    }

    public void setWeeklyDays(int weeklyDays) {
        this.weeklyDays = weeklyDays;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "UserDevice{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", deviceId='" + deviceId + '\'' +
                ", quantity=" + quantity +
                ", dailyHours=" + dailyHours +
                ", weeklyDays=" + weeklyDays +
                ", createdAt=" + createdAt +
                '}';
    }
}

