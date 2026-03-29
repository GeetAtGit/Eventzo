package com.eventzo.budgetservice.controller;

import com.eventzo.budgetservice.dto.AddExpenseRequest;
import com.eventzo.budgetservice.dto.CreateBudgetRequest;
import com.eventzo.budgetservice.entity.BudgetExpense;
import com.eventzo.budgetservice.entity.EventBudget;
import com.eventzo.budgetservice.service.EventBudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class EventBudgetController {

    private final EventBudgetService eventBudgetService;

    public EventBudgetController(EventBudgetService eventBudgetService) {
        this.eventBudgetService = eventBudgetService;
    }

    @PostMapping
    public ResponseEntity<EventBudget> createBudget(@RequestBody CreateBudgetRequest request) {
        return ResponseEntity.ok(eventBudgetService.createBudget(request));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<EventBudget> getBudgetByEventId(@PathVariable String eventId) {
        return ResponseEntity.ok(eventBudgetService.getBudgetByEventId(eventId));
    }

    @PostMapping("/expenses")
    public ResponseEntity<BudgetExpense> addExpense(@RequestBody AddExpenseRequest request) {
        return ResponseEntity.ok(eventBudgetService.addExpense(request));
    }

    @GetMapping("/expenses/event/{eventId}")
    public ResponseEntity<List<BudgetExpense>> getExpenses(@PathVariable String eventId) {
        return ResponseEntity.ok(eventBudgetService.getExpensesByEventId(eventId));
    }
}