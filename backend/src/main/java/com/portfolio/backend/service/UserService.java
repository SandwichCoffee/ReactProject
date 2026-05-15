package com.portfolio.backend.service;

import com.portfolio.backend.vo.UserVO;
import com.portfolio.backend.dto.UserDto;
import com.portfolio.backend.exception.DuplicateEmailException;
import com.portfolio.backend.exception.InvalidCredentialsException;
import com.portfolio.backend.mapper.UserMapper;
import com.portfolio.backend.security.TokenProvider;
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
    private final TokenProvider tokenProvider;

    public void join(UserDto.RegisterRequest dto) {
        if(userMapper.findByEmail(dto.getEmail()) != null) {
            throw new DuplicateEmailException("이미 존재하는 이메일입니다.");
        }

        UserVO user = new UserVO();
        user.setUserId(UUID.randomUUID().toString());
        user.setEmail(dto.getEmail());
        user.setUserName(dto.getUserName());
        user.setRole("USER");
        user.setStatus("Active");

        String encodedPwd = passwordEncoder.encode(dto.getPassword());
        user.setPassword(encodedPwd);

        userMapper.joinUser(user);
    }

    public UserDto.Response login(UserDto.LoginRequest dto) {
        UserVO user = userMapper.findByEmail(dto.getEmail());

        if(user == null) throw new InvalidCredentialsException("아이디 또는 비밀번호가 일치하지 않습니다.");

        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        userMapper.updateLastLogin(user.getUserId());
        
        UserDto.Response response = new UserDto.Response();
        response.setUserId(user.getUserId());
        response.setUserName(user.getUserName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setToken(tokenProvider.generateToken(user.getUserId(), user.getRole()));
        response.setCreatedAt(user.getCreatedAt());
        
        return response;
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
