package com.meeting2tasks.schedulingservice.service;

import com.meeting2tasks.schedulingservice.model.*;
import com.meeting2tasks.schedulingservice.repository.MilestoneRepository;
import com.meeting2tasks.schedulingservice.repository.ProjectMembersRepository;
import com.meeting2tasks.schedulingservice.repository.SprintRepository;
import com.meeting2tasks.schedulingservice.repository.userRepository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchedulingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectMembersRepository projectMembersRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private RestTemplate restTemplate;

    public List<User> getUsersByProjectId(Integer projectId) {
        System.out.println("Fetching users for projectId: " + projectId);
        List<ProjectMembers> members = projectMembersRepository.findByProjectId(projectId);
        System.out.println("Found ProjectMembers: " + (members != null ? members.size() : 0));
        if (members == null || members.isEmpty()) {
            System.out.println("No members found for projectId: " + projectId);
            return Collections.emptyList();
        }
        List<Integer> userIds = members.stream().map(ProjectMembers::getUserId).collect(Collectors.toList());
        return userRepository.findByUserIdIn(userIds)
                .stream()
                .map(user -> {
                    System.out.println("Mapping userId: " + user.getId() + ", Found user: " + user.getName());
                    return user;
                })
                .filter(user -> user != null)
                .collect(Collectors.toList());
    }

    public List<String> getSprintIdsByProjectId(Integer projectId) {
        List<Sprint> sprints = sprintRepository.findByProjectId(projectId);
        return sprints.stream()
                .map(Sprint::getId)
                .collect(Collectors.toList());
    }

    public SprintWithTasks getSprintWithTasks(String sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sprint not found"));

        System.out.println("Fetching milestones for sprintId: " + sprintId);
        List<Milestone> milestones = milestoneRepository.findBySprintId(sprintId);
        System.out.println("Found milestones: " + (milestones != null ? milestones.size() : 0));

        if (milestones == null || milestones.isEmpty()) {
            System.out.println("No milestones found for sprintId: " + sprintId);
            return new SprintWithTasks(sprint, Collections.emptyList());
        }

        List<String> milestoneIds = milestones.stream()
                .map(Milestone::getId)
                .collect(Collectors.toList());
        System.out.println("Milestone IDs: " + milestoneIds);

        List<TaskDTO> tasks = new ArrayList<>();
        for (String milestoneId : milestoneIds) {
            try {
                System.out.println("Fetching tasks for milestoneId: " + milestoneId);
                List<TaskDTO> milestoneTasks = restTemplate.exchange(
                        "http://localhost:8081/api/tasks/milestone/" + milestoneId,
                        org.springframework.http.HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<TaskDTO>>() {}
                ).getBody();

                if (milestoneTasks != null) {
                    System.out.println("Found tasks for milestoneId " + milestoneId + ": " + milestoneTasks.size());
                    tasks.addAll(milestoneTasks);
                } else {
                    System.out.println("No tasks found for milestoneId: " + milestoneId);
                }
            } catch (RestClientException e) {
                System.err.println("Error fetching tasks for milestone " + milestoneId + ": " + e.getMessage());
            }
        }

        System.out.println("Total tasks for sprintId " + sprintId + ": " + tasks.size());
        return new SprintWithTasks(sprint, tasks);
    }

    public List<TaskDTO> getTasksByProjectId(Integer projectId) {
        System.out.println("Fetching tasks for projectId: " + projectId);

        List<String> sprintIds = getSprintIdsByProjectId(projectId);
        System.out.println("Found sprints: " + (sprintIds != null ? sprintIds.size() : 0));

        if (sprintIds == null || sprintIds.isEmpty()) {
            System.out.println("No sprints found for projectId: " + projectId);
            return Collections.emptyList();
        }

        List<TaskDTO> allTasks = new ArrayList<>();
        for (String sprintId : sprintIds) {
            try {
                SprintWithTasks sprintWithTasks = getSprintWithTasks(sprintId);
                if (sprintWithTasks != null && sprintWithTasks.getTasks() != null) {
                    allTasks.addAll(sprintWithTasks.getTasks());
                }
            } catch (ResponseStatusException e) {
                System.err.println("Error fetching tasks for sprint " + sprintId + ": " + e.getMessage());
            }
        }

        System.out.println("Total tasks found: " + allTasks.size());
        return allTasks;
    }

    public List<AiTaskWithUsers> assignUsersToTasks(Integer projectId, List<AiTask> aiTasks) {
        System.out.println("Processing assignUsersToTasks for projectId: " + projectId);
        if (projectId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project ID cannot be null");
        }

        if (aiTasks == null || aiTasks.isEmpty()) {
            return Collections.emptyList();
        }

        List<User> projectUsers = getUsersByProjectId(projectId);
        System.out.println("Total project users found: " + projectUsers.size());
        if (projectUsers.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No users found for project with ID: " + projectId);
        }

        List<AiTaskWithUsers> updatedTasks = new ArrayList<>();
        for (AiTask task : aiTasks) {
            AiTaskWithUsers taskWithUsers = new AiTaskWithUsers();
            taskWithUsers.setTitle(task.getTitle());
            taskWithUsers.setDescription(task.getDescription());
            taskWithUsers.setRole(task.getRole());

            if (task.getRole() == null) {
                taskWithUsers.setAssignableUsers(Collections.emptyList());
            } else {
                List<User> assignableUsers = projectUsers.stream()
                        .filter(user -> task.getRole().equals(user.getRole()))
                        .collect(Collectors.toList());
                taskWithUsers.setAssignableUsers(assignableUsers);
            }
            updatedTasks.add(taskWithUsers);
        }

        return updatedTasks;
    }
}