package com.secure.notes.repositories;

import com.secure.notes.models.Password;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordRepository extends JpaRepository<Password, Long> {
    Password findByUser_UserId(Long userId);
}
