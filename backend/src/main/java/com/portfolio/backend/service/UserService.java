package com.portfolio.backend.service;

import com.portfolio.backend.vo.UserVO;
import com.portfolio.backend.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public void join(UserVO user) {
        if(userMapper.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        user.setUserId(UUID.randomUUID().toString());

        String encodedPwd = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPwd);

        if(user.getRole() == null) user.setRole("USER");
        if(user.getStatus() == null) user.setStatus("Active");

        userMapper.joinUser(user);
    }

    public UserVO login(String email, String password) {
        UserVO user = userMapper.findByEmail(email);

        if(user == null) throw new RuntimeException("존재하지 않는 사용자입니다.");

        if(!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        userMapper.updateLastLogin(user.getUserId());
        user.setPassword(null);

        return user;
    }

    public List<UserVO> getUserList() {
        return userMapper.selectUserList();
    }

    public UserVO getUserById(String id) {
        return userMapper.selectUserById(id);
    }

    public void updateUser(UserVO user) {
        userMapper.updateUser(user);
    }

    public void deleteUser(String id) {
        userMapper.deleteUser(id);
    }
}
