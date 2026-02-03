package com.portfolio.backend.controller;

import com.portfolio.backend.service.UserService;
import com.portfolio.backend.vo.UserVO;
import com.portfolio.backend.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public List<UserVO> getUserList() {
        return userService.getUserList();
    }

    @GetMapping("/{id}")
    public UserVO getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PostMapping("/join")
    public void join(@RequestBody @Valid UserDto.RegisterRequest user) {
        userService.join(user);
    }

    @PostMapping("/login")
    public UserDto.Response login(@RequestBody @Valid UserDto.LoginRequest user) {
        return userService.login(user);
    }

    @PutMapping("/{id}")
    public void updateUser(@PathVariable String id, @RequestBody UserVO user) {
        user.setUserId(id);
        userService.updateUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }
}
