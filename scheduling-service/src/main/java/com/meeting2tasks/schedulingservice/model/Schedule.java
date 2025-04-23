package com.meeting2tasks.schedulingservice.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "schedules")
public class Schedule {
    @Id
    private String id;
    private String taskId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int priority; // 1 (high) to 5 (low)
}
