package com.meeting2tasks.schedulingservice.controller;

import com.meeting2tasks.schedulingservice.model.AiTask;
import com.meeting2tasks.schedulingservice.model.AiTaskWithUsers;
import com.meeting2tasks.schedulingservice.model.TaskDTO;
import com.meeting2tasks.schedulingservice.model.User;
import com.meeting2tasks.schedulingservice.service.SchedulingService;
import com.meeting2tasks.schedulingservice.model.SprintWithTasks;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
@Tag(name = "Scheduling Management", description = "APIs for managing scheduling in the Meeting2Tasks application")
public class SchedulingController {

    @Autowired
    private SchedulingService schedulingService;

    @GetMapping("/users/{projectId}")
    @Operation(summary = "Get users by project ID", description = "Retrieves a list of users associated with a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of users retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "404", description = "Project not found",
                    content = @Content)
    })
    public List<User> getUsersByProjectId(
            @Parameter(description = "ID of the project to retrieve users for") @PathVariable Integer projectId) {
        return schedulingService.getUsersByProjectId(projectId);
    }

    @GetMapping("/sprints/{projectId}")
    @Operation(summary = "Get sprint IDs by project ID", description = "Retrieves a list of sprint IDs associated with a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of sprint IDs retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "404", description = "Project not found",
                    content = @Content)
    })
    public List<String> getSprintIdsByProjectId(
            @Parameter(description = "ID of the project to retrieve sprint IDs for") @PathVariable Integer projectId) {
        return schedulingService.getSprintIdsByProjectId(projectId);
    }

    @GetMapping("/sprint/{sprintId}")
    @Operation(summary = "Get sprint details with tasks", description = "Retrieves sprint details along with its associated tasks")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sprint details retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SprintWithTasks.class))),
            @ApiResponse(responseCode = "404", description = "Sprint not found",
                    content = @Content)
    })
    public SprintWithTasks getSprintWithTasks(
            @Parameter(description = "ID of the sprint to retrieve details for") @PathVariable String sprintId) {
        return schedulingService.getSprintWithTasks(sprintId);
    }

    @GetMapping("/tasks/{projectId}")
    @Operation(summary = "Get tasks by project ID", description = "Retrieves a list of all tasks associated with a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of tasks retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TaskDTO.class))),
            @ApiResponse(responseCode = "404", description = "Project not found or no tasks available",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public List<TaskDTO> getTasksByProjectId(
            @Parameter(description = "ID of the project to retrieve tasks for") @PathVariable Integer projectId) {
        return schedulingService.getTasksByProjectId(projectId);
    }

    @PostMapping("/assign-users-to-tasks")
    @Operation(summary = "Assign users to tasks based on role and project", description = "Receives a list of AiTasks and a project ID, returns a list of AiTaskWithUsers with assignable users and additional task metrics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of AiTaskWithUsers with assignable users retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AiTaskWithUsers.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Project not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public List<AiTaskWithUsers> assignUsersToTasks(
            @RequestParam Integer projectId,
            @RequestBody List<AiTask> aiTasks) {
        return schedulingService.assignUsersToTasks(projectId, aiTasks);
    }
}