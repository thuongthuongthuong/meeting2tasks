package com.meeting2tasks.schedulingservice.model;

import java.util.List;

public class SprintWithTasks {
    private Sprint sprint;
    private List<TaskDTO> tasks;

    public SprintWithTasks(Sprint sprint, List<TaskDTO> tasks) {
        this.sprint = sprint;
        this.tasks = tasks;
    }

    // Getters và setters
    public Sprint getSprint() { return sprint; }
    public void setSprint(Sprint sprint) { this.sprint = sprint; }
    public List<TaskDTO> getTasks() { return tasks; }
    public void setTasks(List<TaskDTO> tasks) { this.tasks = tasks; }
}