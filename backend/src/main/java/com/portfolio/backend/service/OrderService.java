package com.portfolio.backend.service;

import com.portfolio.backend.mapper.CartMapper;
import com.portfolio.backend.mapper.OrderMapper;
import com.portfolio.backend.mapper.ProductMapper;
import com.portfolio.backend.vo.CartVO;
import com.portfolio.backend.vo.OrderDetailVO;
import com.portfolio.backend.vo.OrderVO;
import com.portfolio.backend.dto.SalesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderMapper orderMapper;
    private final CartMapper cartMapper;
    private final ProductMapper productMapper;

    public List<SalesDto> getDailySales() {
        return orderMapper.selectDailySales();
    }

    public int getTotalRevenue() {
        return orderMapper.selectTotalRevenue();
    }

    @Transactional
    public void placeOrder(int userId) {
        // 장바구니 목록
        List<CartVO> cartList = cartMapper.selectCartList(userId);

        if(cartList.isEmpty()) {
            throw new RuntimeException("장바구니가 비어있습니다.");
        }

        int totalAmount = cartList.stream().mapToInt(item -> item.getProdPrice() * item.getQuantity()).sum();

        // 주문번호(20260129-랜덤문자) 생성
        String dateStr = new SimpleDateFormat("yyymmdd").format(new Date());
        String orderNo = dateStr + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        OrderVO order = new OrderVO();
        order.setUserId(userId);
        order.setOrderNo(orderNo);
        order.setTotalAmount(totalAmount);

        orderMapper.insertOrder(order);

        // 주문 상세 정보 저장
        for(CartVO cart: cartList) {
            OrderDetailVO detail = new OrderDetailVO();
            detail.setOrderId(order.getOrderId());
            detail.setProdId(cart.getProdId());
            detail.setPrice(cart.getProdPrice());
            detail.setQuantity(cart.getQuantity());
            orderMapper.insertOrderDetail(detail);

            // 남은 재고 차감
            int updatedRows = productMapper.decreaseStock(cart.getProdId(), cart.getQuantity());
            if(updatedRows == 0) {
                throw new RuntimeException("상품(ID: " + cart.getProdId() + ")의 재고가 부족합니다.");
            }

            // 주문 이후 카트에서 목록 제거
            cartMapper.deleteCart(cart.getCartId());
        }
    }
}
