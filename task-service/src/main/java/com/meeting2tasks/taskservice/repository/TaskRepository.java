package com.meeting2tasks.taskservice.repository;

import com.meeting2tasks.taskservice.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByMilestoneId(String milestoneId);

    List<Task> findByMilestoneIdInAndAssignedUserId(List<String> milestoneIds, String assignedUserId);

    List<Task> findByAssignedUserId(String assignedUserId);
}