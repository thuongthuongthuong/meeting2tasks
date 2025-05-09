package com.meeting2tasks.schedulingservice.service;

import com.meeting2tasks.schedulingservice.model.Sprint;

import java.util.List;

public class SprintWithTasks {
    private Sprint sprintInfo;
    private List<TaskDTO> tasks;

    public SprintWithTasks(Sprint sprintInfo, List<TaskDTO> tasks) {
        this.sprintInfo = sprintInfo;
        this.tasks = tasks;
    }

    public Sprint getSprintInfo() {
        return sprintInfo;
    }

    public List<TaskDTO> getTasks() {
        return tasks;
    }
}
