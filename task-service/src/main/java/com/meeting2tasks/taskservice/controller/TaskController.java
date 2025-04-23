package com.meeting2tasks.taskservice.controller;

import com.meeting2tasks.taskservice.model.KanbanBoard;
import com.meeting2tasks.taskservice.model.RACI;
import com.meeting2tasks.taskservice.model.Task;
import com.meeting2tasks.taskservice.service.TaskProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskProcessingService taskProcessingService;

    @PostMapping("/meeting-notes")
    public List<Task> processMeetingNotes(@RequestBody String meetingNote) {
        return taskProcessingService.processMeetingNotes(meetingNote);
    }

    @GetMapping("/kanban")
    public KanbanBoard getKanbanBoard() {
        return taskProcessingService.getKanbanBoard();
    }

    @GetMapping("/raci")
    public RACI getRACI() {
        return taskProcessingService.getRACI();
    }
}