package com.secure.notes.dtos;

public class PasswordRequest {
    private Long userId;
    private String password;

    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
