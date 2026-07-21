package com.example.PortfolioBackend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Proxies shell commands from the React frontend to the Rust BYO Shell HTTP
 * server.
 * Frontend calls /api/shell/* → this controller → Rust server on
 * byoshell.api.url.
 *
 * Uses java.net.http.HttpClient instead of RestTemplate because the Rust server
 * (tiny-http / hyper) can be sensitive to connection reuse and chunked encoding
 * that the default HttpURLConnection-backed RestTemplate uses.
 */
@RestController
@RequestMapping("/api/shell")
@CrossOrigin(origins = "*")
public class ShellController {

    @Value("${byoshell.api.url}")
    private String byoshellApiUrl;

    @Value("${byoshell.api.key}")
    private String byoshellApiKey;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public ShellController() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .version(HttpClient.Version.HTTP_1_1)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * POST /api/shell/execute
     * Accepts { "command": "..." } from the frontend,
     * wraps it with session_id and forwards to the Rust shell server.
     */
    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeCommand(@RequestBody Map<String, String> request) {
        String command = request.get("command");

        if (command == null || command.trim().isEmpty()) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("ok", false);
            error.put("error", "command is required");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            // Build the JSON payload for the Rust shell server
            Map<String, String> shellRequest = new LinkedHashMap<>();
            shellRequest.put("session_id", "portfolio");
            shellRequest.put("command", command);
            String jsonBody = objectMapper.writeValueAsString(shellRequest);

            HttpRequest.Builder reqBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(byoshellApiUrl + "/execute"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .timeout(Duration.ofSeconds(30));

            if (byoshellApiKey != null && !byoshellApiKey.trim().isEmpty()) {
                reqBuilder.header("Authorization", "Bearer " + byoshellApiKey.trim());
            }

            HttpRequest httpRequest = reqBuilder.build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            @SuppressWarnings("unchecked")
            Map<String, Object> body = objectMapper.readValue(response.body(), Map.class);
            return ResponseEntity.ok(body);

        } catch (Exception e) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("ok", false);
            error.put("error", "Shell server is not reachable");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    /**
     * GET /api/shell/health
     * Proxies to the Rust shell server's /health endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> shellHealth() {
        try {
            HttpRequest.Builder reqBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(byoshellApiUrl + "/health"))
                    .GET()
                    .timeout(Duration.ofSeconds(5));

            if (byoshellApiKey != null && !byoshellApiKey.trim().isEmpty()) {
                reqBuilder.header("Authorization", "Bearer " + byoshellApiKey.trim());
            }

            HttpRequest httpRequest = reqBuilder.build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            @SuppressWarnings("unchecked")
            Map<String, Object> body = objectMapper.readValue(response.body(), Map.class);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("ok", true);
            result.put("shellServer", body);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("ok", false);
            error.put("error", "Shell server is not reachable");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }
}
