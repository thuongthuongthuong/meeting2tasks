package com.meeting2tasks.schedulingservice.model;

import lombok.Data;

import java.util.List;

@Data
public class AiTaskWithUsers {
    private String title;
    private String description;
    private String role;
    private List<User> assignableUsers; // Danh sách user có thể thực hiện task

    public AiTaskWithUsers() {}

    public AiTaskWithUsers(String title, String description, String role, List<User> assignableUsers) {
        this.title = title;
        this.description = description;
        this.role = role;
        this.assignableUsers = assignableUsers;
    }
}