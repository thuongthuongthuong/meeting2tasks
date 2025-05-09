package com.meeting2tasks.taskservice.repository;

import com.meeting2tasks.taskservice.model.Milestone;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MilestoneRepository extends MongoRepository<Milestone, String> {
    List<Milestone> findBySprintId(String sprintId);
}