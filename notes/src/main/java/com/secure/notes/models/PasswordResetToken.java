package com.secure.notes.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Data
public class PasswordResetToken {


    public PasswordResetToken(String token, Instant expiryDate,  User user) {
        this.token = token;
        this.expiryDate = expiryDate;

        this.user = user;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;
    // Instant represents a point in time with a lot grater precision than that of date,
    // Instant gives precision of nanasecond where Date only offers milloseconds


    private boolean used; // whether the token is used or not

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;


    public PasswordResetToken() {

    }
}
