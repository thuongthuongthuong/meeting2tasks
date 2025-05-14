package com.meeting2tasks.schedulingservice.repository;

import com.meeting2tasks.schedulingservice.model.Sprint;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SprintRepository extends MongoRepository<Sprint, String> {
    List<Sprint> findByProjectId(Integer projectId);
}