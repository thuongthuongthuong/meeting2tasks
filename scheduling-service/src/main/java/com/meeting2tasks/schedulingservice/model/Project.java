package com.meeting2tasks.schedulingservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String name;
    private String description;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("start_date")
    private LocalDateTime startDate;

    @Field("end_date")
    private LocalDateTime endDate;
}