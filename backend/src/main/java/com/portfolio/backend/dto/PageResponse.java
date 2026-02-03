package com.portfolio.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class PageResponse<T> {
    private List<T> list;
    private int total;
    
    public PageResponse(List<T> list, int total) {
        this.list = list;
        this.total = total;
    }
}
