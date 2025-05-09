package com.meeting2tasks.schedulingservice.repository.userRepository;

import com.meeting2tasks.schedulingservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {  // Sử dụng String cho _id
    Optional<User> findByUserId(Integer userId);  // Thêm phương thức tìm theo userId
    List<User> findByUserIdIn(List<Integer> userIds);  // Tìm nhiều user cùng lúc
}