# Use an official Maven image to build the project
FROM maven:3.9-eclipse-temurin-17 AS build

# Set the working directory
WORKDIR /app

# Copy the project files
COPY . /app

# Build the project
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as the final image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar /app/app.jar

# Run the JAR file
ENTRYPOINT ["java", "-jar", "/app/app.jar"]