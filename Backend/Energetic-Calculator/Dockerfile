# Etapa 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar archivos de configuración de Maven
COPY pom.xml .
# Descargar dependencias (esto se cachea si pom.xml no cambia)
RUN mvn dependency:go-offline

# Copiar el código fuente
COPY src ./src

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Etapa 2: Runtime
# Usar Debian Slim en lugar de Alpine para compatibilidad con librerías nativas
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Instalar dependencias necesarias para Firebase/gRPC
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Crear un usuario no-root para ejecutar la aplicación
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copiar el JAR desde la etapa de build
COPY --from=build /app/target/Energetic-Calculator-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto (Render usará la variable PORT)
EXPOSE 8081

# Comando para ejecutar la aplicación con optimizaciones para contenedores
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "/app/app.jar"]

