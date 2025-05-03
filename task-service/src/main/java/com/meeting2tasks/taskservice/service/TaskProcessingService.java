package com.meeting2tasks.taskservice.service;

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

    public void updateTasks(List<Task> updatedTasks) {
        taskRepository.saveAll(updatedTasks);
    }
}