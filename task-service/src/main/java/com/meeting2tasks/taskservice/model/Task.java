package com.meeting2tasks.taskservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "tasks")
public class Task {
    @Id
    private String id;
    private String title;
    private String description;
    private String status; // e.g., "To Do", "Draft", "In Review", "Approved", "Created"
    private String assignedUserId;
    private String meetingNoteId;
}