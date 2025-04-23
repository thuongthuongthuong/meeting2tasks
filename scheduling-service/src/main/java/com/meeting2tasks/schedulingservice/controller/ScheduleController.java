package com.meeting2tasks.schedulingservice.controller;

import com.meeting2tasks.schedulingservice.model.Schedule;
import com.meeting2tasks.schedulingservice.service.SchedulingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private SchedulingService schedulingService;

    @PostMapping("/schedule")
    public Schedule scheduleTask(@RequestBody String meetingNote) {
        return schedulingService.scheduleTask(meetingNote);
    }

    @GetMapping("/task/{taskId}")
    public Schedule getScheduleByTaskId(@PathVariable String taskId) {
        return schedulingService.getScheduleByTaskId(taskId);
    }

    @GetMapping
    public List<Schedule> getAllSchedules() {
        return schedulingService.getAllSchedules();
    }
}
