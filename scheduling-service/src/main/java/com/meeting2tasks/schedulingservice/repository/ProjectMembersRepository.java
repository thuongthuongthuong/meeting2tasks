package com.meeting2tasks.schedulingservice.repository;

import com.meeting2tasks.schedulingservice.model.ProjectMembers;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectMembersRepository extends MongoRepository<ProjectMembers, String> {
    List<ProjectMembers> findByProjectId(String projectId);
}