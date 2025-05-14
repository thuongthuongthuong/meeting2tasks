package com.meeting2tasks.schedulingservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String _id;

    private Integer id;
    private String name;
    private String role;
    private String avatar;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime created_at;

    private Integer tasksInCurrentProject;
    private Integer totalTasksAcrossProjects;
    private Double match_percentage;

    // Setter cho các trường mới (nếu cần)
    public void setTasksInCurrentProject(Integer tasksInCurrentProject) {
        this.tasksInCurrentProject = tasksInCurrentProject;
    }

    public void setTotalTasksAcrossProjects(Integer totalTasksAcrossProjects) {
        this.totalTasksAcrossProjects = totalTasksAcrossProjects;
    }

    public void setMatch_percentage(Double match_percentage) {
        this.match_percentage = match_percentage;
    }
}