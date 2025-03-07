package com.secure.notes.controllers;

import com.secure.notes.models.DataUpload;
import com.secure.notes.models.User;
import com.secure.notes.services.DataUploadService;
import com.secure.notes.services.UserService;
import com.secure.notes.services.impl.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/data")
public class DataUploadController {

    private final DataUploadService dataUploadService;
    private final UserService userService;

    public DataUploadController(DataUploadService dataUploadService, UserService userService) {
        this.dataUploadService = dataUploadService;
        this.userService = userService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadData(
            @RequestParam String data,
            @RequestParam String dataPassword,
            Principal principal) {

        Optional<User> user = userService.findByEmail(principal.getName());
        dataUploadService.saveDataUpload(data, dataPassword, user);

        return ResponseEntity.ok("Data uploaded successfully.");
    }

    @GetMapping("/view")
    public ResponseEntity<?> viewData(@RequestParam String dataPassword, Principal principal) {
        Optional<User> user = userService.findByEmail(principal.getName());
        List<DataUpload> uploads = dataUploadService.getDataUploadsByUser(user);

        // Filter uploads by data password
        List<DataUpload> filteredUploads = uploads.stream()
                .filter(upload -> upload.getDataPassword().equals(dataPassword))
                .toList();

        if (filteredUploads.isEmpty()) {
            return ResponseEntity.status(403).body("Incorrect password or no data available.");
        }


        return ResponseEntity.ok(filteredUploads);
    }




}
