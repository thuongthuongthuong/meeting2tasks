package com.meeting2tasks.schedulingservice.repository;

import com.meeting2tasks.schedulingservice.model.Schedule;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ScheduleRepository extends MongoRepository<Schedule, String> {
    Optional<Schedule> findByTaskId(String taskId);
}
