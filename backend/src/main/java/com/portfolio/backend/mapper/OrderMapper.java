package com.portfolio.backend.mapper;

import com.portfolio.backend.dto.SalesDto;
import com.portfolio.backend.vo.OrderDetailVO;
import com.portfolio.backend.vo.OrderVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface OrderMapper {
    List<SalesDto> selectDailySales();
    List<SalesDto> selectWeeklySales();
    List<SalesDto> selectMonthlySales();
    List<SalesDto> selectYearlySales();
    int selectTotalRevenue();
    void insertOrder(OrderVO order);
    void insertOrderDetail(OrderDetailVO detail);
}
