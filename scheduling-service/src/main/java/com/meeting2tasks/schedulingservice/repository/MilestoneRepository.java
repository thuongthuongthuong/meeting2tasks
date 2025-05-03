package com.meeting2tasks.schedulingservice.repository;

import com.meeting2tasks.schedulingservice.model.Milestone;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MilestoneRepository extends MongoRepository<Milestone, String> {
    List<Milestone> findBySprintId(String sprintId);
}