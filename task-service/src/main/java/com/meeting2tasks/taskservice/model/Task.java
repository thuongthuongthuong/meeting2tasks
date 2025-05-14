package com.meeting2tasks.taskservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Document(collection = "tasks")
public class Task {
    @Id
    private String id;

    @Field("milestone_id")
    private String milestoneId;

    @Field("assigned_user_id")
    private String assignedUserId;

    private String name;
    private String description;

    @Field("assigned_at")
    private LocalDateTime assignedAt;

    @Field("deadline")
    private LocalDateTime deadline;

    private String priority; // e.g., "Low", "Medium", "High"

    @Field("story_points")
    private Integer storyPoints;

    private String type; // e.g., "Bug", "Feature", "Task"
    private String status; // e.g., "To Do", "In Progress", "Done"
    private String meetingNoteId;

    // Constructor
    public Task() {
        this.id = UUID.randomUUID().toString(); // Tạo ID ngẫu nhiên
    }
}