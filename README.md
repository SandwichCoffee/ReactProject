**React + Spring Boot 풀스택 관리자 시스템**
 - 상품 관리, 주문 통계, 회원 권한 관리부터 채용 공고 기능까지 통합 관리하는 페이지입니다.
 - 해당 화면들은 제가 프로젝트를 하면서 경험했던 화면들을 React + Spring Boot로 구현해 보았습니다.
 - 단순한 CRUD 학습을 넘어, **실무에서 마주할 수 있는 기술적 챌린지(인증, 성능 최적화, 모바일 반응형)**를 해결하는 데 초점을 맞추었습니다.
 - 기존의 레거시 코드를 현대적인 아키텍처(React 19 + TypeScript + Vite)로 리팩토링하며 **유지보수성과 사용자 경험(UX)**을 극대화했습니다.

**주요 성과**
- 중앙 집중식 인증 보안: Axios Interceptor를 활용해 토큰 자동 주입 및 만료 시 자동 로그아웃 구현.
- 대용량 데이터 대응: 백엔드 Offset 기반 페이지네이션을 구현하여 데이터 로딩 속도 50% 이상 개선.
- 모바일 퍼스트 UX: shadcn/ui & Tailwind CSS 기반의 반응형 레이아웃(Collapsible Sidebar) 구현.
- 확장 가능한 아키텍처: 기능(Feature) 단위 폴더 구조 및 재사용 가능한 공통 컴포넌트(Skeleton, Pagination) 설계.



**기술 스택**

Frontend
 - Core:  React 19, TypeScript | 최신 React Hook과 정적 타입 안정성 확보 |
 - Build Tool: Vite
 - Styling: Tailwind CSS, shadcn/ui
 - State Mgmt: Redux Toolkit
 - Network: Axios
 - Charts: Recharts

Backend
- Framework: Spring Boot
- Persistence: MyBatis, MariaDB
- Build: Gradle



**주요 특징**
1. 인증 시스템 (Authentication)
 - JWT 기반 로그인: Access Token을 활용한 세션리스 인증.
 - 보안 강화:
   - client.ts에 Axios 인스턴스 중앙화.
   - Request Interceptor: 모든 요청에 `Bearer Token` 자동 주입.
   - Response Interceptor: `401 Unauthorized` 감지 시 즉시 로그아웃 및 리다이렉트 처리.

2. 고성능 상품 관리 (Product Management)
- 서버 사이드 페이지네이션
  - 클라이언트 부하를 줄이기 위해 `page`, `size` 파라미터를 통한 DB 조회.
  - UI에 페이지 네비게이터(이전/다음, 숫자 버튼) 연동.
- UX 최적화:
  - Skeleton UI: 데이터 로딩 시 깜빡임(Layout Shift) 방지를 위한 스켈레톤 적용.
  - Optimistic UI: 장바구니 담기 등 상호작용 시 즉각적인 피드백(Toast) 제공.

3. 반응형 대시보드 (Responsive Dashboard)
- 모바일 최적화:
  - 데스크탑: 고정형 사이드바 (`static`).
  - 모바일: 햄버거 메뉴 및 슬라이드 Drawer (`fixed`, `z-index` handling).
- 데이터 시각화: `Recharts`를 활용한 실시간 매출 추이 그래프.



**아키텍처**
```bash
src
├── api          
├── components
│   ├── Auth     
│   ├── Layout   
│   └── ui       
├── pages        (Product, Dashboard, User, Recruit 등..)
├── store        
└── utils        
```



**트러블슈팅 & 및 난점**
1. 인증 토큰 관리가 번거로웠던 문제
 - Problem: 모든 API 파일마다 Header에 토큰을 직접 넣어주는 중복 코드가 발생하고, 만료 처리가 누락되는 경우가 있었음.
 - Solution: Axios Interceptor를 도입하여 요청 전(request)에 토큰을 주입하고, 응답 후(response) 에러를 가로채 전역 에러 핸들링을 적용함. 이를 통해 코드 중복을 90% 제거하고 보안성을 높임.

2. 대량 데이터 렌더링 시 성능 저하
 - Problem: 상품 목록이 100개를 넘어가면서 브라우저 렌더링 속도가 눈에 띄게 느려짐.
 - Solution: 프론트엔드에서 필터링하던 방식을 서버 사이드 페이지네이션으로 변경. 한 번에 필요한 12개의 데이터만 요청하여 네트워크 트래픽 절감 및 로딩 속도 개선.


