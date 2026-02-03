package com.portfolio.backend.service;

import com.portfolio.backend.dto.RecruitDto;
import com.portfolio.backend.mapper.RecruitMapper;
import com.portfolio.backend.vo.RecruitVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecruitService {
    private final RecruitMapper recruitMapper;

    public List<RecruitDto.Response> getList() {
        return recruitMapper.selectRecruitList().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public RecruitDto.Response getDetail(int id) {
        return toResponse(recruitMapper.selectRecruitById(id));
    }

    public void create(RecruitDto.Request dto) {
        RecruitVO vo = new RecruitVO();
        vo.setTitle(dto.getTitle());
        vo.setContents(dto.getContents());
        vo.setStatus(dto.getStatus());
        vo.setStartDate(dto.getStartDate());
        vo.setEndDate(dto.getEndDate());
        
        recruitMapper.insertRecruit(vo);
    }

    public void update(int id, RecruitDto.Request dto) {
        RecruitVO vo = new RecruitVO();
        vo.setRecruitId(id);
        vo.setTitle(dto.getTitle());
        vo.setContents(dto.getContents());
        vo.setStatus(dto.getStatus());
        vo.setStartDate(dto.getStartDate());
        vo.setEndDate(dto.getEndDate());

        recruitMapper.updateRecruit(vo);
    }

    public void delete(int id) {
        recruitMapper.deleteRecruit(id);
    }

    private RecruitDto.Response toResponse(RecruitVO vo) {
        if (vo == null) return null;
        RecruitDto.Response response = new RecruitDto.Response();
        response.setRecruitId(vo.getRecruitId());
        response.setTitle(vo.getTitle());
        response.setContents(vo.getContents());
        response.setStatus(vo.getStatus());
        response.setStartDate(vo.getStartDate());
        response.setEndDate(vo.getEndDate());
        response.setRegDate(vo.getRegDate());
        return response;
    }
}
