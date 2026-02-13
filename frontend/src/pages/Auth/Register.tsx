import { useNavigate } from "react-router-dom";
import { registerUser } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, UserPlus } from "lucide-react";

const registerSchema = z
  .object({
    email: z.string().email("유효한 이메일을 입력해주세요."),
    userName: z.string().min(2, "이름은 2자 이상이어야 합니다."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        userName: data.userName,
      });
      toast.success("회원가입 성공! 로그인 해주세요.");
      navigate("/login");
    } catch (error) {
      toast.error("회원가입 실패: 이미 사용 중인 이메일일 수 있습니다.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-[400px] shadow-lg border-border">
        <CardHeader className="space-y-1 relative pb-2 pt-10">
          <Button
            variant="ghost"
            className="absolute left-4 top-4 text-muted-foreground hover:text-foreground"
            type="button"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 뒤로가기
          </Button>
          <div className="w-full text-center">
            <CardTitle>회원가입</CardTitle>
          </div>
      </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-5">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName">이름</Label>
              <Input
                id="userName"
                type="text"
                {...register("userName")}
                className={errors.userName ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.userName && (
                <p className="text-sm text-destructive">{errors.userName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full font-bold gap-2" size="lg" disabled={isSubmitting}>
              <UserPlus className="h-4 w-4" />
              {isSubmitting ? "가입 처리 중..." : "가입하기"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
