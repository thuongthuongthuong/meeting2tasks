package com.meeting2tasks.schedulingservice.model;

import lombok.Data;

import java.util.List;

@Data
public class AiTask {
    private String title;
    private String description;
    private String role;
}
