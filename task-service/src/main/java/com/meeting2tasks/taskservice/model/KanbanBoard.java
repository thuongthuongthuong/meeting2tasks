package com.meeting2tasks.taskservice.model;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class KanbanBoard {
    private Map<String, List<Task>> columns; // e.g., "To Do" -> List<Task>
}