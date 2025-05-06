package com.meeting2tasks.schedulingservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@Document(collection = "project_members")
public class ProjectMembers {
    @Id
    private String id;

    @Field("user_id")
    private Integer userId;

    @Field("project_id")
    private Integer projectId;

    @Field("joined_at")
    private LocalDateTime joinedAt;
}