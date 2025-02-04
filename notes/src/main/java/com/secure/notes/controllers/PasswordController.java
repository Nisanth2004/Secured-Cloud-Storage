package com.secure.notes.controllers;

import com.secure.notes.services.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {

    @Autowired
    private PasswordService passwordService;

    @PostMapping("/save")
    public ResponseEntity<String> savePassword(@RequestParam Long userId, @RequestParam String password) {
        passwordService.savePassword(userId, password);
        return ResponseEntity.ok("Password saved successfully!");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<String> getPassword(@PathVariable Long userId) {
        String password = passwordService.getPasswordByUserId(userId);
        return password != null ? ResponseEntity.ok(password) : ResponseEntity.notFound().build();
    }
}
