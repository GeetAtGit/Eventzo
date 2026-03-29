package com.eventzo.budgetservice.dto;

import java.math.BigDecimal;

public class AddExpenseRequest {
    private String eventId;
    private String userId;
    private String category;
    private String description;
    private BigDecimal amount;

    public AddExpenseRequest() {}

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}