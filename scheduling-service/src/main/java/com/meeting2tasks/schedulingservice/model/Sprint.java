package com.meeting2tasks.schedulingservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;

@Data
@Document(collection = "sprints")
public class Sprint {
    @Id
    private String id;

    @Field("project_id")
    private String projectId;

    private String name;
    private String description;

    @Field("start_date")
    private LocalDate startDate;

    @Field("end_date")
    private LocalDate endDate;
}