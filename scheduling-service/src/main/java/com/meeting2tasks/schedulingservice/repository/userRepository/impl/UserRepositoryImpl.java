package com.meeting2tasks.schedulingservice.repository.userRepository.impl;

import com.meeting2tasks.schedulingservice.model.User;
import com.meeting2tasks.schedulingservice.repository.userRepository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.repository.query.FluentQuery;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;


public class UserRepositoryImpl implements UserRepository {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public UserRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Optional<User> findByUserId(Integer userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        User user = mongoTemplate.findOne(query, User.class, "users");
        return Optional.ofNullable(user);
    }

    @Override
    public List<User> findByUserIdIn(List<Integer> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return new ArrayList<>();
        }
        Query query = new Query(Criteria.where("id").in(userIds));
        return mongoTemplate.find(query, User.class, "users");
    }

    @Override
    public Optional<User> findById(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        User user = mongoTemplate.findOne(query, User.class, "users");
        return Optional.ofNullable(user);
    }

    @Override
    public boolean existsById(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        return mongoTemplate.exists(query, User.class, "users");
    }

    @Override
    public List<User> findAll() {
        return mongoTemplate.findAll(User.class, "users");
    }

    @Override
    public List<User> findAllById(Iterable<String> ids) {
        List<String> idList = new ArrayList<>();
        ids.forEach(idList::add);
        Query query = new Query(Criteria.where("_id").in(idList));
        return mongoTemplate.find(query, User.class, "users");
    }

    @Override
    public long count() {
        return mongoTemplate.count(new Query(), User.class, "users");
    }

    @Override
    public void deleteById(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        mongoTemplate.remove(query, User.class, "users");
    }

    @Override
    public void delete(User entity) {
        mongoTemplate.remove(entity, "users");
    }

    @Override
    public void deleteAllById(Iterable<? extends String> ids) {
        List<String> idList = new ArrayList<>();
        ids.forEach(idList::add);
        Query query = new Query(Criteria.where("_id").in(idList));
        mongoTemplate.remove(query, User.class, "users");
    }

    @Override
    public void deleteAll(Iterable<? extends User> entities) {
        entities.forEach(entity -> mongoTemplate.remove(entity, "users"));
    }

    @Override
    public void deleteAll() {
        mongoTemplate.remove(new Query(), User.class, "users");
    }

    @Override
    public <S extends User> S save(S entity) {
        return mongoTemplate.save(entity, "users");
    }

    @Override
    public <S extends User> List<S> saveAll(Iterable<S> entities) {
        List<S> result = new ArrayList<>();
        entities.forEach(entity -> result.add(mongoTemplate.save(entity, "users")));
        return result;
    }

    @Override
    public List<User> findAll(Sort sort) {
        Query query = new Query();
        if (sort != null) {
            query.with(sort);
        }
        return mongoTemplate.find(query, User.class, "users");
    }

    @Override
    public Page<User> findAll(Pageable pageable) {
        // Triển khai phân trang cần thêm logic phức tạp hơn, tạm thời trả về null
        throw new UnsupportedOperationException("Pagination not implemented");
    }

    @Override
    public <S extends User> S insert(S entity) {
        return mongoTemplate.insert(entity, "users");
    }

    @Override
    public <S extends User> List<S> insert(Iterable<S> entities) {
        List<S> result = new ArrayList<>();
        entities.forEach(entity -> result.add(mongoTemplate.insert(entity, "users")));
        return result;
    }

    @Override
    public <S extends User> Optional<S> findOne(Example<S> example) {
        throw new UnsupportedOperationException("findOne by Example not implemented");
    }

    @Override
    public <S extends User> List<S> findAll(Example<S> example) {
        throw new UnsupportedOperationException("findAll by Example not implemented");
    }

    @Override
    public <S extends User> List<S> findAll(Example<S> example, Sort sort) {
        throw new UnsupportedOperationException("findAll by Example with Sort not implemented");
    }

    @Override
    public <S extends User> Page<S> findAll(Example<S> example, Pageable pageable) {
        throw new UnsupportedOperationException("findAll by Example with Pageable not implemented");
    }

    @Override
    public <S extends User> long count(Example<S> example) {
        throw new UnsupportedOperationException("count by Example not implemented");
    }

    @Override
    public <S extends User> boolean exists(Example<S> example) {
        throw new UnsupportedOperationException("exists by Example not implemented");
    }

    @Override
    public <S extends User, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        throw new UnsupportedOperationException("findBy with FluentQuery not implemented");
    }
}