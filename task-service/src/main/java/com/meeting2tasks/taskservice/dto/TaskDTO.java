package com.meeting2tasks.taskservice.dto;

import lombok.Data;

@Data
public class TaskDTO {
    private String userId;
    private String title;
    private String description;
    private String priority;
    private Integer story_points;
    private String type;
}