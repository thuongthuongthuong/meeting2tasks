package com.meeting2tasks.schedulingservice.model;

public class TaskDTO {
    private String userId;
    private String title;
    private String description;
    private String priority;
    private Integer story_points;
    private String type;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Integer getStory_points() { return story_points; }
    public void setStory_points(Integer story_points) { this.story_points = story_points; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}