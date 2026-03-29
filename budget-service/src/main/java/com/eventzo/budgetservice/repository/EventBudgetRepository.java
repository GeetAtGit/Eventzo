package com.eventzo.budgetservice.repository;

import com.eventzo.budgetservice.entity.EventBudget;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface EventBudgetRepository extends MongoRepository<EventBudget, String> {
    Optional<EventBudget> findByEventId(String eventId);
}