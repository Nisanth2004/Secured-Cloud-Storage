package com.secure.notes.services;

import com.secure.notes.models.Password;
import com.secure.notes.models.User;
import com.secure.notes.repositories.PasswordRepository;
import com.secure.notes.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PasswordService {

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Password savePassword(Long userId, String rawPassword) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String encodedPassword = passwordEncoder.encode(rawPassword);

            Password password = new Password(user, encodedPassword);
            return passwordRepository.save(password);
        }
        throw new RuntimeException("User not found!");
    }

    public String getPasswordByUserId(Long userId) {
        Password password = passwordRepository.findByUser_UserId(userId);
        return password != null ? password.getPassword() : null;
    }
}
