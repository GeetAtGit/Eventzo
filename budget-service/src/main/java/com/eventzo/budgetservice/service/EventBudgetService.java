package com.eventzo.budgetservice.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.eventzo.budgetservice.dto.AddExpenseRequest;
import com.eventzo.budgetservice.dto.CreateBudgetRequest;
import com.eventzo.budgetservice.entity.BudgetExpense;
import com.eventzo.budgetservice.entity.EventBudget;
import com.eventzo.budgetservice.repository.BudgetExpenseRepository;
import com.eventzo.budgetservice.repository.EventBudgetRepository;

@Service
public class EventBudgetService {

    private final EventBudgetRepository eventBudgetRepository;
    private final BudgetExpenseRepository budgetExpenseRepository;

    public EventBudgetService(EventBudgetRepository eventBudgetRepository,
                              BudgetExpenseRepository budgetExpenseRepository) {
        this.eventBudgetRepository = eventBudgetRepository;
        this.budgetExpenseRepository = budgetExpenseRepository;
    }

    public EventBudget createBudget(CreateBudgetRequest request) {
        EventBudget budget = new EventBudget();
        budget.setEventId(request.getEventId());
        budget.setUserId(request.getUserId());
        budget.setTotalBudget(request.getTotalBudget());
        budget.setSpentAmount(BigDecimal.ZERO);
        budget.setRemainingAmount(request.getTotalBudget());
        return eventBudgetRepository.save(budget);
    }

    public EventBudget getBudgetByEventId(String eventId) {
    return eventBudgetRepository.findByEventId(eventId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Budget not found for event: " + eventId));
}

    public BudgetExpense addExpense(AddExpenseRequest request) {
        EventBudget budget = getBudgetByEventId(request.getEventId());

        BudgetExpense expense = new BudgetExpense();
        expense.setEventId(request.getEventId());
        expense.setUserId(request.getUserId());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        budgetExpenseRepository.save(expense);

        // Update budget totals
        BigDecimal newSpent = budget.getSpentAmount().add(request.getAmount());
        budget.setSpentAmount(newSpent);
        budget.setRemainingAmount(budget.getTotalBudget().subtract(newSpent));
        eventBudgetRepository.save(budget);

        return expense;
    }

    public List<BudgetExpense> getExpensesByEventId(String eventId) {
        return budgetExpenseRepository.findByEventId(eventId);
    }
}