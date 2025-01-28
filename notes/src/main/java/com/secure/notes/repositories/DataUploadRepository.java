package com.secure.notes.repositories;

import com.secure.notes.models.DataUpload;
import com.secure.notes.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DataUploadRepository extends JpaRepository<DataUpload, Long> {
    List<DataUpload> findByUser(Optional<User> user);
}
