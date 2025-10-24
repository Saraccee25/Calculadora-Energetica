package com.example.Energetic_Calculator.model;

public class Device {

    private String id; // Firestore genera este ID automáticamente si lo dejas null
    private String nombre;
    private String categoria; // Cocina, Lavandería, Clima, etc.
    private int potenciaWatts;
    private float horasUsoDiario;
    private int diasUsoMensual;

    // Constructor vacío
    public Device() {
    }

    // Constructor con todos los parámetros
    public Device(String id, String nombre, String categoria, int potenciaWatts, float horasUsoDiario, int diasUsoMensual) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.potenciaWatts = potenciaWatts;
        this.horasUsoDiario = horasUsoDiario;
        this.diasUsoMensual = diasUsoMensual;
    }

    // Getters y Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public int getPotenciaWatts() {
        return potenciaWatts;
    }

    public void setPotenciaWatts(int potenciaWatts) {
        this.potenciaWatts = potenciaWatts;
    }

    public float getHorasUsoDiario() {
        return horasUsoDiario;
    }

    public void setHorasUsoDiario(float horasUsoDiario) {
        this.horasUsoDiario = horasUsoDiario;
    }

    public int getDiasUsoMensual() {
        return diasUsoMensual;
    }

    public void setDiasUsoMensual(int diasUsoMensual) {
        this.diasUsoMensual = diasUsoMensual;
    }

    // Opcional: método toString() para depuración
    @Override
    public String toString() {
        return "Device{" +
                "id='" + id + '\'' +
                ", nombre='" + nombre + '\'' +
                ", categoria='" + categoria + '\'' +
                ", potenciaWatts=" + potenciaWatts +
                ", horasUsoDiario=" + horasUsoDiario +
                ", diasUsoMensual=" + diasUsoMensual +
                '}';
    }
}