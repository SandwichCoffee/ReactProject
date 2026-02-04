package com.portfolio.backend.mapper;

import com.portfolio.backend.vo.DevLogVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface DevLogMapper {
    List<DevLogVO> selectDevLogList();
    void insertDevLog(DevLogVO vo);
    void updateDevLog(DevLogVO vo);
    void deleteDevLog(int logId);
    DevLogVO selectDevLogById(int logId);
}
