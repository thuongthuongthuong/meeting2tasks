package com.meeting2tasks.taskservice.service;

import com.meeting2tasks.taskservice.model.KanbanBoard;
import com.meeting2tasks.taskservice.model.RACI;
import com.meeting2tasks.taskservice.model.Task;
import com.meeting2tasks.taskservice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class TaskProcessingService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ai.model.url}")
    private String aiModelUrl;

    public List<Task> processMeetingNotes(String meetingNote) {
        // Gọi FastAPI của AI Model để tạo tasks
        List<Task> tasks = callAiModel(meetingNote);

        // Lưu tasks vào MongoDB
        taskRepository.saveAll(tasks);

        return tasks;
    }

    private List<Task> callAiModel(String meetingNote) {
        // Tạo body JSON cho request
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("user_input", meetingNote);
        requestBody.put("project_id", null); // Có thể thay đổi nếu có project_id

        // Thiết lập header cho request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Tạo HttpEntity với body và header
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // Gọi API của ai-service
        Task[] tasksArray = restTemplate.postForObject(aiModelUrl, requestEntity, Task[].class);

        return tasksArray != null ? Arrays.asList(tasksArray) : Collections.emptyList();
    }

    public KanbanBoard getKanbanBoard() {
        Map<String, List<Task>> columns = new HashMap<>();
        columns.put("To Do", taskRepository.findByStatus("To Do"));
        columns.put("Draft", taskRepository.findByStatus("Draft"));
        columns.put("In Review", taskRepository.findByStatus("In Review"));
        columns.put("Approved", taskRepository.findByStatus("Approved"));
        columns.put("Created", taskRepository.findByStatus("Created"));

        KanbanBoard kanbanBoard = new KanbanBoard();
        kanbanBoard.setColumns(columns);
        return kanbanBoard;
    }

    public RACI getRACI() {
        List<Task> tasks = taskRepository.findAll();
        Map<String, Map<String, String>> roles = new HashMap<>();

        for (Task task : tasks) {
            Map<String, String> taskRoles = new HashMap<>();
            taskRoles.put("Responsible", task.getAssignedUserId());
            taskRoles.put("Accountable", task.getAssignedUserId());
            taskRoles.put("Consulted", "");
            taskRoles.put("Informed", "");
            roles.put(task.getId(), taskRoles);
        }

        RACI raci = new RACI();
        raci.setRoles(roles);
        return raci;
    }

    public void updateTasks(List<Task> updatedTasks) {
        taskRepository.saveAll(updatedTasks);
    }
}