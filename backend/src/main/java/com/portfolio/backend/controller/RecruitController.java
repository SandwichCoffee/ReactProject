package com.portfolio.backend.controller;

import com.portfolio.backend.service.RecruitService;
import com.portfolio.backend.dto.RecruitDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruits")
@RequiredArgsConstructor
public class RecruitController {
    private final RecruitService recruitService;

    @GetMapping
    public List<RecruitDto.Response> getList() {
        return recruitService.getList();
    }

    @GetMapping("/{id}")
    public RecruitDto.Response getDetail(@PathVariable int id) {
        return recruitService.getDetail(id);
    }

    @PostMapping
    public void create(@RequestBody @Valid RecruitDto.Request dto) {
        recruitService.create(dto);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable int id, @RequestBody @Valid RecruitDto.Request dto) {
        recruitService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        recruitService.delete(id);
    }
}
