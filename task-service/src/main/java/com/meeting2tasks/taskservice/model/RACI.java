package com.meeting2tasks.taskservice.model;

import lombok.Data;

import java.util.Map;

@Data
public class RACI {
    private Map<String, Map<String, String>> roles; // e.g., taskId -> { "Responsible": userId, "Accountable": userId, ... }
}