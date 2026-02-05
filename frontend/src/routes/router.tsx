import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard/Dashboard";
import MySettings from "@/pages/Users/MySettings";
import UserList from "@/pages/Users/UserList";
import UserDetail from "@/pages/Users/UserDetail";
import UserCreate from "@/pages/Users/UserCreate";
import UserActivity from "@/pages/Users/UserActivity";
import UserSettings from "@/pages/Users/UserSettings";
import ProductList from "@/pages/Products/ProductList";
import ProductCreate from "@/pages/Products/ProductCreate";
import ProductDetail from "@/pages/Products/ProductDetail";
import ProductEdit from "@/pages/Products/ProductEdit";
import Resume from "@/pages/About/Resume";
import RecruitList from "@/pages/Recruit/RecruitList";
import RecruitWrite from "@/pages/Recruit/RecruitWrite";
import RecruitDetail from "@/pages/Recruit/RecruitDetail";
import DevLogList from "@/pages/DevLog/DevLogList";
import DevLogWrite from "@/pages/DevLog/DevLogWrite";
import CartList from "@/pages/Cart/CartList";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AdminRoute from "@/components/Auth/AdminRoute";

export const router = createBrowserRouter([
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "resume", element: <Resume /> },
  {
    path: "/",
    element: <ProtectedRoute />, 
    children: [
      {
        element: <Layout />,
        children: [

          { index: true, element: <Dashboard /> },
          {
            path: "users",
            element: <AdminRoute />,
            children: [
              { index: true, element: <UserList /> },
              { path: "new", element: <UserCreate /> },
              {
                path: ":id",
                element: <UserDetail />,
                children: [
                  { index: true, element: <UserActivity /> },
                  { path: "activity", element: <UserActivity /> },
                  { path: "settings", element: <UserSettings /> },
                ],
              },
            ],
          },
          {
            path: "products",
            children: [
              { index: true, element: <ProductList /> },
              {
                element: <AdminRoute />,
                children: [
                  { path: "new", element: <ProductCreate /> },
                  { path: ":id/edit", element: <ProductEdit /> },
                ],
              },
              { path: ":id", element: <ProductDetail /> },
            ],
          },
          {
            path: "recruits",
            children: [
              { index: true, element: <RecruitList /> },
              { path: "new", element: <RecruitWrite /> },
              { path: ":id", element: <RecruitDetail /> },
              { path: ":id/edit", element: <RecruitWrite /> },
            ],
          },
          {
            path: "devlogs",
            children: [
              { index: true, element: <DevLogList /> },
              { path: "new", element: <DevLogWrite /> },
              { path: ":id/edit", element: <DevLogWrite /> },
            ],
          },
          { path: "cart", element: <CartList /> },
          { path: "settings", element: <MySettings /> },
        ],
      },
    ],
  }
], {
  basename: "/ReactProject"
});
