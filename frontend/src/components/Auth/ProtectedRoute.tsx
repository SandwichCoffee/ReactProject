import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        // 로그인 안되어있으면 로그인 페이지로 리다이렉트
        // replace: true로 뒤로가기 방지
        return <Navigate to="/login" replace />;
    }

    // 로그인 되어있으면 자식 라우트 렌더링
    return <Outlet />;
};

export default ProtectedRoute;
