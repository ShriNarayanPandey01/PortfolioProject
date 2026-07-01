package com.example.PortfolioBackend;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PortfolioController {

    @Value("${portfolio.data.path:../data}")
    private String dataDirPath;

    private final ObjectMapper objectMapper;

    public PortfolioController() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    private Path getDataFilePath(String fileName) {
        return Paths.get(dataDirPath).resolve(fileName).normalize().toAbsolutePath();
    }

    private Map<String, Object> readPortfolioData() throws IOException {
        Path path = getDataFilePath("portfolioData.json");
        if (!Files.exists(path)) {
            throw new IOException("portfolioData.json not found at " + path);
        }
        return objectMapper.readValue(path.toFile(), new TypeReference<Map<String, Object>>() {});
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", true);
        response.put("service", "portfolio-api");
        response.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/portfolio")
    public ResponseEntity<Map<String, Object>> getPortfolio() {
        try {
            Map<String, Object> data = readPortfolioData();
            return ResponseEntity.ok(data);
        } catch (IOException e) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("ok", false);
            errorResponse.put("error", "Could not load portfolio data.");
            errorResponse.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/projects/backend")
    public ResponseEntity<?> getBackendProjects() {
        try {
            Map<String, Object> data = readPortfolioData();
            Object backendProjects = data.get("backendProjects");
            if (backendProjects == null) {
                return ResponseEntity.ok(Collections.emptyList());
            }
            return ResponseEntity.ok(backendProjects);
        } catch (IOException e) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("ok", false);
            errorResponse.put("error", "Could not load backend projects.");
            errorResponse.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/profiles")
    public ResponseEntity<?> getProfiles() {
        try {
            Map<String, Object> data = readPortfolioData();
            Object codingProfiles = data.get("codingProfiles");
            if (codingProfiles == null) {
                return ResponseEntity.ok(Collections.emptyList());
            }
            return ResponseEntity.ok(codingProfiles);
        } catch (IOException e) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("ok", false);
            errorResponse.put("error", "Could not load coding profiles.");
            errorResponse.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> submitContact(@RequestBody Map<String, String> contactForm) {
        String name = contactForm.get("name");
        String email = contactForm.get("email");
        String message = contactForm.get("message");

        if (name == null || name.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            message == null || message.trim().isEmpty()) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("ok", false);
            errorResponse.put("error", "name, email, and message are required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        Map<String, Object> submission = new LinkedHashMap<>();
        submission.put("id", UUID.randomUUID().toString());
        submission.put("name", name.trim());
        submission.put("email", email.trim());
        submission.put("message", message.trim());
        submission.put("createdAt", Instant.now().toString());

        try {
            Path messagesPath = getDataFilePath("messages.json");
            List<Map<String, Object>> messages;

            if (Files.exists(messagesPath)) {
                String content = Files.readString(messagesPath);
                if (content.trim().isEmpty()) {
                    messages = new ArrayList<>();
                } else {
                    messages = objectMapper.readValue(messagesPath.toFile(), new TypeReference<List<Map<String, Object>>>() {});
                }
            } else {
                messages = new ArrayList<>();
            }

            messages.add(submission);
            objectMapper.writeValue(messagesPath.toFile(), messages);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("ok", true);
            response.put("message", "Message received successfully.");
            response.put("submission", submission);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("ok", false);
            errorResponse.put("error", "Could not store the contact message.");
            errorResponse.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
