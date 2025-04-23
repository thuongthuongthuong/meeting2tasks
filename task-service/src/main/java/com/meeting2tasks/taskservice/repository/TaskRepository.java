package com.meeting2tasks.taskservice.repository;

import com.meeting2tasks.taskservice.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByStatus(String status);
}