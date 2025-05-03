package com.meeting2tasks.schedulingservice.service;

import com.meeting2tasks.schedulingservice.model.Milestone;
import com.meeting2tasks.schedulingservice.model.ProjectMembers;
import com.meeting2tasks.schedulingservice.model.Sprint;
import com.meeting2tasks.schedulingservice.model.User;
import com.meeting2tasks.schedulingservice.repository.MilestoneRepository;
import com.meeting2tasks.schedulingservice.repository.ProjectMembersRepository;
import com.meeting2tasks.schedulingservice.repository.SprintRepository;
import com.meeting2tasks.schedulingservice.repository.UserRepository;
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

    public List<User> getUsersByProjectId(String projectId) {
        List<ProjectMembers> members = projectMembersRepository.findByProjectId(projectId);
        return members.stream()
                .map(member -> userRepository.findById(member.getUserId()).orElse(null))
                .filter(user -> user != null)
                .collect(Collectors.toList());
    }

    public List<String> getSprintIdsByProjectId(String projectId) {
        List<Sprint> sprints = sprintRepository.findByProjectId(projectId);
        return sprints.stream()
                .map(Sprint::getId)
                .collect(Collectors.toList());
    }

    public SprintWithTasks getSprintWithTasks(String sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sprint not found"));

        List<Milestone> milestones = milestoneRepository.findBySprintId(sprintId);
        if (milestones == null || milestones.isEmpty()) {
            return new SprintWithTasks(sprint, Collections.emptyList());
        }

        List<String> milestoneIds = milestones.stream()
                .map(Milestone::getId)
                .collect(Collectors.toList());

        List<TaskDTO> tasks = new ArrayList<>();
        for (String milestoneId : milestoneIds) {
            try {
                List<TaskDTO> milestoneTasks = restTemplate.exchange(
                        "http://task-service:8081/api/tasks/milestone/" + milestoneId,
                        org.springframework.http.HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<TaskDTO>>() {}
                ).getBody();

                if (milestoneTasks != null) {
                    tasks.addAll(milestoneTasks);
                }
            } catch (RestClientException e) {
                System.err.println("Error fetching tasks for milestone " + milestoneId + ": " + e.getMessage());
            }
        }

        return new SprintWithTasks(sprint, tasks);
    }
}

class TaskDTO {
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
