package com.portfolio.backend.controller;

import com.portfolio.backend.mapper.RecruitMapper;
import com.portfolio.backend.vo.RecruitVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruits")
@RequiredArgsConstructor
public class RecruitController {
    private final RecruitMapper recruitMapper;

    @GetMapping
    public List<RecruitVO>getList() {
        return recruitMapper.selectRecruitList();
    }

    @GetMapping("/{id}")
    public RecruitVO getDetail(@PathVariable int id) {
      return recruitMapper.selectRecruitById(id);
    }

    @PostMapping
    public void create(@RequestBody RecruitVO recruit) {
        recruitMapper.insertRecruit(recruit);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable int id, @RequestBody RecruitVO recruit) {
        recruit.setRecruitId(id);
        recruitMapper.updateRecruit(recruit);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        recruitMapper.deleteRecruit(id);
    }
}
