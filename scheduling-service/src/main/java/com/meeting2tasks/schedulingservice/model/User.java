package com.meeting2tasks.schedulingservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String role;
    private String avatar;

    @Field("created_at")
    private LocalDateTime createdAt;
}