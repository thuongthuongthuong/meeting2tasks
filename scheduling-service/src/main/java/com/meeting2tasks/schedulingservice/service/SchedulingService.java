package com.meeting2tasks.schedulingservice.service;

import com.meeting2tasks.schedulingservice.model.Schedule;
import com.meeting2tasks.schedulingservice.model.Task;
import com.meeting2tasks.schedulingservice.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SchedulingService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${task.service.url}")
    private String taskServiceUrl;

    public Schedule scheduleTask(String meetingNote) {
        // Gọi Task Service để lấy danh sách tasks
        String url = taskServiceUrl + "/meeting-notes";
        Task[] tasks = restTemplate.postForObject(url, meetingNote, Task[].class);

        if (tasks == null || tasks.length == 0) {
            throw new RuntimeException("No tasks found for the given meeting note");
        }

        // Lấy task đầu tiên (giả sử chỉ xử lý 1 task cho đơn giản)
        Task task = tasks[0];

        // Kiểm tra xem task đã có lịch trình chưa
        Optional<Schedule> existingSchedule = scheduleRepository.findByTaskId(task.getId());
        if (existingSchedule.isPresent()) {
            return existingSchedule.get();
        }

        // Tạo lịch trình mới
        Schedule schedule = new Schedule();
        schedule.setId(UUID.randomUUID().toString());
        schedule.setTaskId(task.getId());
        schedule.setStartDate(LocalDateTime.now());
        schedule.setEndDate(LocalDateTime.now().plusDays(7)); // Ví dụ: task kéo dài 7 ngày
        schedule.setPriority(1); // Độ ưu tiên cao nhất

        // Lưu lịch trình vào MongoDB
        return scheduleRepository.save(schedule);
    }

    public Schedule getScheduleByTaskId(String taskId) {
        return scheduleRepository.findByTaskId(taskId)
                .orElseThrow(() -> new RuntimeException("Schedule not found for taskId: " + taskId));
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }
}