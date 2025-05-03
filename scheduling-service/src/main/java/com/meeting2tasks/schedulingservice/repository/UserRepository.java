package com.meeting2tasks.schedulingservice.repository;

import com.meeting2tasks.schedulingservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}