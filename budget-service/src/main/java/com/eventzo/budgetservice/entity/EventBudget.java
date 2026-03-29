package com.eventzo.budgetservice.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;

@Document(collection = "event_budgets")
public class EventBudget {

    @Id
    private String id;
    private String eventId;
    private String userId;
    private BigDecimal totalBudget;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;

    public EventBudget() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public BigDecimal getTotalBudget() { return totalBudget; }
    public void setTotalBudget(BigDecimal totalBudget) { this.totalBudget = totalBudget; }
    public BigDecimal getSpentAmount() { return spentAmount; }
    public void setSpentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; }
    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }
}