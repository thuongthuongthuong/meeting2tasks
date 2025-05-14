package com.meeting2tasks.schedulingservice.repository;

import com.meeting2tasks.schedulingservice.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project, String> {
}