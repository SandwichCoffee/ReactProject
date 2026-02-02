package com.portfolio.backend.mapper;

import com.portfolio.backend.vo.RecruitVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface RecruitMapper {
    List<RecruitVO> selectRecruitList();
    RecruitVO selectRecruitById(int recruitId);
    void insertRecruit(RecruitVO recruit);
    void updateRecruit(RecruitVO recruit);
    void deleteRecruit(int recruitId);
}
