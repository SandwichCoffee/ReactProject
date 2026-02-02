package com.portfolio.backend.controller;

import com.portfolio.backend.service.UserService;
import com.portfolio.backend.vo.UserVO;
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
    public void join(@RequestBody UserVO user) {
        userService.join(user);
    }

    @PostMapping("/login")
    public UserVO login(@RequestBody UserVO user) {
        return userService.login(user.getEmail(), user.getPassword());
    }

    // 기존 insertUser는 관리자용 또는 테스트용으로 남겨두거나 제거 (여기서는 join으로 대체되므로 제거해도 무방하나, 기존 코드 유지 차원에서 둠)
    @PostMapping
    public void insertUser(@RequestBody UserVO user) {
        userService.join(user);
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
