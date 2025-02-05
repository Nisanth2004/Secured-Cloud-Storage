package com.secure.notes.controllers;

import com.secure.notes.dtos.PasswordRequest;
import com.secure.notes.services.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/public/passwords")
public class PasswordController {

    @Autowired
    private PasswordService passwordService;

    @PostMapping("/save")
    public ResponseEntity<String> savePassword(@RequestBody PasswordRequest request) {
        passwordService.savePassword(request.getUserId(), request.getPassword());
        return ResponseEntity.ok("Password saved successfully!");
    }


    @GetMapping("/{userId}")
    public ResponseEntity<String> getPassword(@PathVariable Long userId) {
        String password = passwordService.getPasswordByUserId(userId);
        return password != null ? ResponseEntity.ok(password) : ResponseEntity.notFound().build();
    }
}
