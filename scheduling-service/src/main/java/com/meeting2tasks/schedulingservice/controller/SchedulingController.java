package com.meeting2tasks.schedulingservice.controller;

import com.meeting2tasks.schedulingservice.model.User;
import com.meeting2tasks.schedulingservice.service.SchedulingService;
import com.meeting2tasks.schedulingservice.service.SprintWithTasks;
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
            @Parameter(description = "ID of the project to retrieve users for") @PathVariable String projectId) {
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
            @Parameter(description = "ID of the project to retrieve sprint IDs for") @PathVariable String projectId) {
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
}