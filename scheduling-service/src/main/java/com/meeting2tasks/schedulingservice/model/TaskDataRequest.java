package com.meeting2tasks.schedulingservice.model;

import lombok.Data;

import java.util.List;

@Data
public class TaskDataRequest {
    private List<AiTaskWithUsers> tasks;

    public TaskDataRequest(List<AiTaskWithUsers> tasks) {
        this.tasks = tasks;
    }
}