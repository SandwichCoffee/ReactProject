# React + Spring Boot Admin Portfolio

React + Spring Boot 기반의 풀스택 관리자 시스템입니다.  
단순 CRUD를 넘어서 인증/인가, 페이지네이션, 파일 업로드, 대시보드 통계까지 실제 운영 시나리오를 기준으로 구현했습니다.

## Demo
- Frontend (GitHub Pages): `https://sandwichcoffee.github.io/ReactProject/`
- Backend API (Render): `https://reactproject-q472.onrender.com`

## Preview
<table>
  <tr>
    <td><img width="400" alt="대시보드" src="https://github.com/user-attachments/assets/133866ce-2570-4d5c-8c84-a77e33d92601" /></td>
    <td><img width="400" alt="상품관리" src="https://github.com/user-attachments/assets/22b32bce-0d1a-44b9-a323-ba9e80dcfbdd" /></td>
  </tr>
  <tr>
    <td><img width="400" alt="회원관리" src="https://github.com/user-attachments/assets/b2dc01a9-63d0-49bf-8950-9eddaa01c157" /></td>
    <td><img width="400" alt="채용공고" src="https://github.com/user-attachments/assets/dd8e8bc4-4107-4e48-acac-9736a1d6ec80" /></td>
  </tr>
</table>

## Tech Stack
- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Query, Axios, Recharts
- Backend: Spring Boot 3, Java 17, MyBatis, MariaDB, Gradle, Spring Security

## Core Features
- 인증/인가
  - 로그인 시 토큰 발급
  - Axios 인터셉터로 `Authorization: Bearer ...` 자동 주입
  - 서버에서 토큰 검증 및 역할 기반 인가 적용
- 사용자/권한 관리
  - 회원가입/로그인
  - 관리자 전용 사용자 목록/수정/삭제
- 상품 관리
  - 상품 CRUD
  - 이미지 업로드 및 `/images/**` 정적 서빙
  - 서버 사이드 페이지네이션(`page`, `size`)
- 주문/장바구니
  - 장바구니 담기/수량 수정/삭제
  - 주문 생성 및 재고 차감
  - 기간별 매출 통계(일/주/월/년)
- 채용/개발로그
  - 채용공고 CRUD
  - 개발로그 CRUD

## Security Policy (Current)
- 공개 API
  - `POST /api/users/join`
  - `POST /api/users/login`
- 관리자 전용 API
  - `GET|PUT|DELETE /api/users/**`
  - `POST /api/products`
  - `POST /api/products/*`
  - `DELETE /api/products/*`
- 그 외 `/api/**`는 인증 필요

## Error Response Policy
- `400 Bad Request`: 입력 검증 실패, 잘못된 요청 형식
- `401 Unauthorized`: 로그인 실패/인증 실패
- `409 Conflict`: 중복 이메일, 상태 충돌
- `500 Internal Server Error`: 내부 예외

## Project Structure
```text
.
├── frontend/
│   ├── src/api
│   ├── src/components
│   ├── src/pages
│   ├── src/routes
│   └── src/store
└── backend/
    ├── src/main/java/com/portfolio/backend/
    │   ├── config
    │   ├── controller
    │   ├── service
    │   ├── mapper
    │   ├── dto
    │   └── vo
    └── src/main/resources/
        ├── mapper
        ├── sql/local-schema.sql
        └── application*.yml
```

## Local Run
### 1) Database
```bash
mysql -u <admin-user> -p
```
`portfolio` DB 생성 후 아래 스키마 적용:
```bash
mysql -h 127.0.0.1 -P 3306 -u portfolio_app -pportfolio1234 < backend/src/main/resources/sql/local-schema.sql
```

### 2) Backend
```bash
cd backend
SPRING_PROFILES_ACTIVE=local DB_USERNAME=portfolio_app DB_PASSWORD=portfolio1234 ./gradlew bootRun
```

### 3) Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment
### Frontend (GitHub Pages)
```bash
cd frontend
npm run deploy
```

### Backend
- Render 환경변수: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `FILE_UPLOAD_DIR`, `TOKEN_SECRET`
- 프로필: `SPRING_PROFILES_ACTIVE=prod`

## Troubleshooting
- `POST /api/users/join` 500 + DB 권한 에러:
  - `root` 대신 앱 전용 계정(`portfolio_app`)으로 접속 정보 지정
- 로그인 실패 시 `/login` 404:
  - HashRouter 환경에서는 `#/login`으로 이동해야 함
- macOS Node 실행 시 `libsimdjson` 에러:
  - `brew reinstall node simdjson` 후 재실행

## What I Improved
- 프론트 가드에 의존하던 구조를 서버 인가 강제로 보완
- 회원가입/로그인 실패가 전부 500으로 떨어지던 응답 체계를 4xx/5xx로 분리
- 로컬 업로드 경로를 OS 독립 경로(`user.home`) 기반으로 개선

