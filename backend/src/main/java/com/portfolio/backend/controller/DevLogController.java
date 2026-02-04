package com.portfolio.backend.controller;

import com.portfolio.backend.dto.DevLogDto;
import com.portfolio.backend.service.DevLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devlogs")
@RequiredArgsConstructor
public class DevLogController {
    private final DevLogService devLogService;

    @GetMapping
    public List<DevLogDto.Response> getList() {
        return devLogService.getList();
    }
    
    @GetMapping("/{id}")
    public DevLogDto.Response getDetail(@PathVariable int id) {
        return devLogService.getDetail(id);
    }

    @PostMapping
    public void create(@RequestBody @Valid DevLogDto.Request dto) {
        devLogService.create(dto);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable int id, @RequestBody @Valid DevLogDto.Request dto) {
        devLogService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        devLogService.delete(id);
    }
}
