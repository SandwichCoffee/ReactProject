package com.portfolio.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;

@Component
public class TokenProvider {
    private static final String HMAC_ALGO = "HmacSHA256";

    @Value("${app.security.token-secret:change-me-local-token-secret}")
    private String tokenSecret;

    @Value("${app.security.token-expiration-seconds:86400}")
    private long tokenExpirationSeconds;

    public String generateToken(String userId, String role) {
        long expiresAt = Instant.now().getEpochSecond() + tokenExpirationSeconds;
        String normalizedRole = normalizeRole(role);
        String payload = userId + "|" + normalizedRole + "|" + expiresAt;
        String payloadEncoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        byte[] signature = sign(payload);
        String signatureEncoded = Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        return payloadEncoded + "." + signatureEncoded;
    }

    public AuthPayload parseToken(String token) {
        if (token == null || token.isBlank()) return null;
        String[] parts = token.split("\\.");
        if (parts.length != 2) return null;

        String payload;
        try {
            payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return null;
        }

        byte[] expectedSignature = sign(payload);
        byte[] actualSignature;
        try {
            actualSignature = Base64.getUrlDecoder().decode(parts[1]);
        } catch (IllegalArgumentException e) {
            return null;
        }

        if (!MessageDigest.isEqual(expectedSignature, actualSignature)) return null;

        String[] fields = payload.split("\\|");
        if (fields.length != 3) return null;

        long expiresAt;
        try {
            expiresAt = Long.parseLong(fields[2]);
        } catch (NumberFormatException e) {
            return null;
        }

        if (Instant.now().getEpochSecond() > expiresAt) return null;

        return new AuthPayload(fields[0], normalizeRole(fields[1]));
    }

    private byte[] sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGO);
            SecretKeySpec keySpec = new SecretKeySpec(tokenSecret.getBytes(StandardCharsets.UTF_8), HMAC_ALGO);
            mac.init(keySpec);
            return mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to sign token", e);
        }
    }

    private String normalizeRole(String role) {
        return "admin".equalsIgnoreCase(role) ? "ADMIN" : "USER";
    }

    public record AuthPayload(String userId, String role) {}
}
