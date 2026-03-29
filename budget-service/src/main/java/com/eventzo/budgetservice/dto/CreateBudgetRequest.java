package com.eventzo.budgetservice.dto;

import java.math.BigDecimal;

public class CreateBudgetRequest {
    private String eventId;
    private String userId;
    private BigDecimal totalBudget;

    public CreateBudgetRequest() {}

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public BigDecimal getTotalBudget() { return totalBudget; }
    public void setTotalBudget(BigDecimal totalBudget) { this.totalBudget = totalBudget; }
}