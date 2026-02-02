package com.portfolio.backend.mapper;

import com.portfolio.backend.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface UserMapper {
    List<UserVO> selectUserList();
    UserVO selectUserById(String id);
    void joinUser(UserVO user);
    void updateUser(UserVO user);
    void deleteUser(String id);
    UserVO findByEmail(String email);
    void updateLastLogin(String userId);
}
