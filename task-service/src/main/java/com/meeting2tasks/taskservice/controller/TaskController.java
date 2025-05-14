package com.meeting2tasks.taskservice.controller;

import com.meeting2tasks.taskservice.dto.ApiResponse;
import com.meeting2tasks.taskservice.dto.TaskDTO;
import com.meeting2tasks.taskservice.model.AiTask;
import com.meeting2tasks.taskservice.model.Milestone;
import com.meeting2tasks.taskservice.model.Task;
import com.meeting2tasks.taskservice.repository.MilestoneRepository;
import com.meeting2tasks.taskservice.repository.TaskRepository;
import com.meeting2tasks.taskservice.service.TaskProcessingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Task Management", description = "APIs for managing tasks in the Meeting2Tasks application")
public class TaskController {

    @Autowired
    private TaskProcessingService taskProcessingService;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    @PostMapping("/meeting-notes")
    @Operation(summary = "Process meeting notes and create tasks", description = "Takes a meeting note and processes it to create tasks")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tasks created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Task.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid meeting note provided",
                    content = @Content)
    })
    public List<AiTask> processMeetingNotes(
            @Parameter(description = "Request containing meeting note text") @RequestBody TaskRequest request) {
        return taskProcessingService.processMeetingNotes(request.getMeetingNote());
    }

    @PostMapping("/sprint/{sprintId}")
    @Operation(summary = "Add a new task to a sprint", description = "Adds a new task to the first milestone of the specified sprint")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task added successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Sprint or milestone not found",
                    content = @Content)
    })
    public ResponseEntity<ApiResponse> addTask(
            @Parameter(description = "ID of the sprint to add the task to") @PathVariable String sprintId,
            @Parameter(description = "Task details") @RequestBody TaskDTO taskDTO) {
        List<Milestone> milestones = milestoneRepository.findBySprintId(sprintId);
        if (milestones.isEmpty()) {
            return ResponseEntity.status(404).body(new ApiResponse(false, "No milestone found for the given sprint"));
        }
        String milestoneId = milestones.get(0).getId();

        Task task = new Task();
        task.setMilestoneId(milestoneId);
        task.setAssignedUserId(taskDTO.getUserId());
        task.setName(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setPriority(taskDTO.getPriority());
        task.setStoryPoints(taskDTO.getStory_points());
        task.setType(taskDTO.getType());
        task.setStatus(taskDTO.getStatus());
        task.setAssignedAt(LocalDateTime.now());
        task.setDeadline(LocalDateTime.now().plusDays(7));

        taskRepository.save(task);
        return ResponseEntity.ok(new ApiResponse(true, "Task added successfully"));
    }

    @DeleteMapping("/{taskId}")
    @Operation(summary = "Delete a task", description = "Deletes a task by its ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task removed successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task not found",
                    content = @Content)
    })
    public ResponseEntity<ApiResponse> removeTask(
            @Parameter(description = "ID of the task to delete") @PathVariable String taskId) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isPresent()) {
            taskRepository.deleteById(taskId);
            return ResponseEntity.ok(new ApiResponse(true, "Task removed successfully"));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Task not found"));
        }
    }

    @PutMapping("/{taskId}")
    @Operation(summary = "Update a task", description = "Updates an existing task by its ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task not found",
                    content = @Content)
    })
    public ResponseEntity<ApiResponse> editTask(
            @Parameter(description = "ID of the task to update") @PathVariable String taskId,
            @Parameter(description = "Updated task details") @RequestBody TaskDTO taskDTO) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setAssignedUserId(taskDTO.getUserId());
            task.setName(taskDTO.getTitle());
            task.setDescription(taskDTO.getDescription());
            task.setPriority(taskDTO.getPriority());
            task.setStoryPoints(taskDTO.getStory_points());
            task.setType(taskDTO.getType());
            task.setStatus(taskDTO.getStatus());
            taskRepository.save(task);
            return ResponseEntity.ok(new ApiResponse(true, "Task updated successfully"));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Task not found"));
        }
    }

    @GetMapping("/milestone/{milestoneId}")
    @Operation(summary = "Get tasks by milestone ID", description = "Retrieves a list of tasks associated with a milestone")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "List of tasks retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TaskDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Milestone not found",
                    content = @Content)
    })
    public List<TaskDTO> getTasksByMilestoneId(
            @Parameter(description = "ID of the milestone to retrieve tasks for") @PathVariable String milestoneId) {
        List<Task> tasks = taskRepository.findByMilestoneId(milestoneId);

        return tasks.stream().map(task -> {
            TaskDTO taskDTO = new TaskDTO();
            taskDTO.setId(task.getId());
            taskDTO.setUserId(task.getAssignedUserId());
            taskDTO.setTitle(task.getName());
            taskDTO.setDescription(task.getDescription());
            taskDTO.setPriority(task.getPriority());
            taskDTO.setStory_points(task.getStoryPoints());
            taskDTO.setType(task.getType());
            taskDTO.setStatus(task.getStatus());
            return taskDTO;
        }).collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}/sprint/{sprintId}/count")
    @Operation(summary = "Get the number of tasks a user has in a sprint", description = "Retrieves the count of tasks assigned to a user within a specific sprint")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task count retrieved successfully",
                    content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Sprint not found",
                    content = @Content)
    })
    public ResponseEntity<Integer> getUserTaskCountInSprint(
            @Parameter(description = "ID of the user to retrieve task count for") @PathVariable String userId,
            @Parameter(description = "ID of the sprint to check tasks in") @PathVariable String sprintId) {
        // Tìm tất cả các milestone thuộc sprintId
        List<Milestone> milestones = milestoneRepository.findBySprintId(sprintId);
        if (milestones.isEmpty()) {
            return ResponseEntity.status(404).body(0); // Trả về 0 nếu không tìm thấy sprint
        }

        // Lấy danh sách milestoneId
        List<String> milestoneIds = milestones.stream()
                .map(Milestone::getId)
                .collect(Collectors.toList());

        // Đếm số task của user trong các milestone này
        long taskCount = taskRepository.findByMilestoneIdInAndAssignedUserId(milestoneIds, userId).size();

        return ResponseEntity.ok((int) taskCount);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all tasks assigned to a user", description = "Retrieves a list of tasks assigned to a specific user")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "List of tasks retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TaskDTO.class)))
    })
    public List<TaskDTO> getTasksByUserId(
            @Parameter(description = "ID of the user to retrieve tasks for") @PathVariable String userId) {
        List<Task> tasks = taskRepository.findByAssignedUserId(userId);

        return tasks.stream().map(task -> {
            TaskDTO taskDTO = new TaskDTO();
            taskDTO.setId(task.getId());
            taskDTO.setUserId(task.getAssignedUserId());
            taskDTO.setTitle(task.getName());
            taskDTO.setDescription(task.getDescription());
            taskDTO.setPriority(task.getPriority());
            taskDTO.setStory_points(task.getStoryPoints());
            taskDTO.setType(task.getType());
            taskDTO.setStatus(task.getStatus());
            return taskDTO;
        }).collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}/total-count")
    @Operation(summary = "Get the total number of tasks assigned to a user", description = "Retrieves the total count of tasks assigned to a specific user")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Total task count retrieved successfully",
                    content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User has no tasks",
                    content = @Content)
    })
    public ResponseEntity<Integer> getTotalTaskCountByUserId(
            @Parameter(description = "ID of the user to retrieve total task count for") @PathVariable String userId) {
        List<Task> tasks = taskRepository.findByAssignedUserId(userId);
        int totalCount = tasks.size();
        return ResponseEntity.ok(totalCount);
    }
}

class TaskRequest {
    private String meetingNote;

    public String getMeetingNote() {
        return meetingNote;
    }

    public void setMeetingNote(String meetingNote) {
        this.meetingNote = meetingNote;
    }
}