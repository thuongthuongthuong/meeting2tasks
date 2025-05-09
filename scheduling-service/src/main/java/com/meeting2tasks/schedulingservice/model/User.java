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
    private String _id;

    private Integer id;
    private String name;
    private String role;
    private String avatar;
    private LocalDateTime created_at;
}