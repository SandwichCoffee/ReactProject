package com.portfolio.backend.service;

import com.portfolio.backend.dto.DevLogDto;
import com.portfolio.backend.mapper.DevLogMapper;
import com.portfolio.backend.vo.DevLogVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DevLogService {
    private final DevLogMapper devLogMapper;

    @Transactional(readOnly = true)
    public List<DevLogDto.Response> getList() {
        return devLogMapper.selectDevLogList().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public DevLogDto.Response getDetail(int id) {
        DevLogVO vo = devLogMapper.selectDevLogById(id);
        if (vo == null) throw new RuntimeException("해당 로그를 찾을 수 없습니다.");
        return toResponse(vo);
    }

    @Transactional
    public void create(DevLogDto.Request dto) {
        DevLogVO vo = new DevLogVO();
        vo.setTitle(dto.getTitle());
        vo.setContent(dto.getContent());
        vo.setType(dto.getType());
        devLogMapper.insertDevLog(vo);
    }

    @Transactional
    public void update(int id, DevLogDto.Request dto) {
        DevLogVO vo = new DevLogVO();
        vo.setLogId(id);
        vo.setTitle(dto.getTitle());
        vo.setContent(dto.getContent());
        vo.setType(dto.getType());
        devLogMapper.updateDevLog(vo);
    }

    @Transactional
    public void delete(int id) {
        devLogMapper.deleteDevLog(id);
    }

    private DevLogDto.Response toResponse(DevLogVO vo) {
        DevLogDto.Response response = new DevLogDto.Response();
        response.setLogId(vo.getLogId());
        response.setTitle(vo.getTitle());
        response.setContent(vo.getContent());
        response.setType(vo.getType());
        response.setRegDate(vo.getRegDate());
        return response;
    }
}
