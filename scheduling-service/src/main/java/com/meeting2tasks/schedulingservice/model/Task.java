package com.meeting2tasks.schedulingservice.model;

import lombok.Data;

@Data
public class Task {
    private String id;
    private String title;
    private String description;
    private String status;
    private String assignedUserId;
    private String meetingNoteId;
}
