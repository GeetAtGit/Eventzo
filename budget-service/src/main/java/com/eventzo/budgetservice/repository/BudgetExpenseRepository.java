package com.eventzo.budgetservice.repository;

import com.eventzo.budgetservice.entity.BudgetExpense;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BudgetExpenseRepository extends MongoRepository<BudgetExpense, String> {
    List<BudgetExpense> findByEventId(String eventId);
}