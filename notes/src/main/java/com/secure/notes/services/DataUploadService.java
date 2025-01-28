package com.secure.notes.services;

import com.secure.notes.models.DataUpload;
import com.secure.notes.models.User;
import com.secure.notes.repositories.DataUploadRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DataUploadService {
    private final DataUploadRepository dataUploadRepository;

    public DataUploadService(DataUploadRepository dataUploadRepository) {
        this.dataUploadRepository = dataUploadRepository;
    }

    public DataUpload saveDataUpload(String data, String dataPassword, Optional<User> user) {
        DataUpload dataUpload = new DataUpload(data, dataPassword, user);
        return dataUploadRepository.save(dataUpload);
    }

    public List<DataUpload> getDataUploadsByUser(Optional<User> user) {
        return dataUploadRepository.findByUser(user);
    }
}
