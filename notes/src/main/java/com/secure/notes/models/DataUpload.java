package com.secure.notes.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Data
@NoArgsConstructor
@Table(name = "data_uploads")
public class DataUpload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "upload_id")
    private Long uploadId;

    @Column(nullable = false)
    private String data;

    @Column(nullable = false)
    private String dataPassword;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Changed Optional<User> to User

    public DataUpload(String data, String dataPassword, User user) { // Updated constructor
        this.data = data;
        this.dataPassword = dataPassword;
        this.user = user;
    }

    public DataUpload(String data, String dataPassword, Optional<User> user) {
    }
}
