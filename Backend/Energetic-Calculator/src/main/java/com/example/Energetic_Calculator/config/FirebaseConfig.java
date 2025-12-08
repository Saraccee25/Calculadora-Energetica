package com.example.Energetic_Calculator.config;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.type}")
    private String type;

    @Value("${firebase.project-id}")
    private String projectId;

    @Value("${firebase.private-key-id}")
    private String privateKeyId;

    @Value("${firebase.private-key}")
    private String privateKey;

    @Value("${firebase.client-email}")
    private String clientEmail;

    @Value("${firebase.client-id}")
    private String clientId;

    @Value("${firebase.auth-uri}")
    private String authUri;

    @Value("${firebase.token-uri}")
    private String tokenUri;

    @Value("${firebase.auth-provider-x509-cert-url}")
    private String authProviderX509CertUrl;

    @Value("${firebase.client-x509-cert-url}")
    private String clientX509CertUrl;

    @Value("${firebase.universe-domain}")
    private String universeDomain;

    @Value("${firebase.database-url}")
    private String databaseUrl;

    @PostConstruct
    public void initializeFirebase() throws IOException {
        // Construir el JSON de las credenciales desde las variables de entorno
        String credentialsJson = String.format(
            "{"
            + "\"type\": \"%s\","
            + "\"project_id\": \"%s\","
            + "\"private_key_id\": \"%s\","
            + "\"private_key\": \"%s\","
            + "\"client_email\": \"%s\","
            + "\"client_id\": \"%s\","
            + "\"auth_uri\": \"%s\","
            + "\"token_uri\": \"%s\","
            + "\"auth_provider_x509_cert_url\": \"%s\","
            + "\"client_x509_cert_url\": \"%s\","
            + "\"universe_domain\": \"%s\""
            + "}",
            type, projectId, privateKeyId, privateKey.replace("\n", "\\n"),
            clientEmail, clientId, authUri, tokenUri,
            authProviderX509CertUrl, clientX509CertUrl, universeDomain
        );

        ByteArrayInputStream credentialsStream = new ByteArrayInputStream(credentialsJson.getBytes());
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .setProjectId(projectId)
                .setDatabaseUrl(databaseUrl)
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
            System.out.println("✅ Firebase inicializado correctamente con Realtime Database desde variables de entorno");
        }
    }

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        initializeFirebase();
        return FirebaseApp.getInstance();
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}
