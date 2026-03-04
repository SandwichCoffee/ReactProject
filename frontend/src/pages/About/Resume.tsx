import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Layout, Server, Terminal, Copy, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Resume() {
  const navigate = useNavigate();

  const skills = {
    backend: ["Java 17", "Spring Boot 3", "JPA / Hibernate", "MyBatis", "MariaDB", "Gradle"],
    frontend: ["React", "TypeScript", "Tailwind CSS", "Redux Toolkit", "TanStack Query", "Shadcn UI"],
    tools: ["Git & GitHub", "IntelliJ IDEA", "VS Code", "Postman", "Notion"]
  };

  const experience = [
    {
      company: "투비소프트에이엑스 (Tobesoft AX)",
      period: "2023.11 - Present",
      role: "Frontend & Full Stack Developer",
      details: [
        {
          project: "RPA 포탈 및 농협물류 관리자 시스템 구축",
          desc: "Legacy(Nexacro N) 시스템을 모던 웹(React) 환경으로 리팩토링 및 전환",
          tasks: [
             "Nexacro 데이터 바인딩 로직을 분석하여 React Hook 및 상태 관리 구조로 재설계",
             "컴포넌트 재사용성을 고려한 UI 모듈화 및 공통 로직 분리",
             "렌더링 방식 개선을 통한 웹 퍼포먼스 최적화"
          ]
        },
        {
          project: "엔터프라이즈 시스템 마이그레이션 (LX 판토스, 한국마사회 등)",
          desc: "노후화된 miPlatform 기반 시스템을 Nexacro N으로 고도화",
          tasks: [
             "물류/공공 도메인 비즈니스 로직 분석 및 신규 플랫폼 이관",
             "대용량 데이터 그리드 처리 및 성능 최적화",
             "C/S 환경의 UX를 웹 표준 환경에 맞게 개선"
          ]
        }
      ]
    },
    {
      company: "더블루션 (Doublution)",
      period: "2022.01 - 2022.11",
      role: "Full Stack Developer (Spring Boot & Vue.js)",
      details: [
        {
          project: "KT 알파 에어맵/실내공기질 관리 시스템",
          desc: "Spring Boot 및 Vue.js 기반의 관제 시스템 개발",
          tasks: [
            "Spring Boot RESTful API 설계 및 MVC 패턴 적용",
            "Vue.js 기반 관리자 대시보드 UI 개발",
            "PostgreSQL/MyBatis 활용 데이터 모델링 및 통계 쿼리 최적화"
          ]
        }
      ]
    },
    {
      company: "이글루시큐리티 & 시큐어스",
      period: "2018.05 - 2020.09",
      role: "Infra Engineer & Security Analyst",
      details: [
        {
          project: "보안 위협 분석 및 인프라 운영",
          desc: "금융권 웹 취약점 점검 및 서버/네트워크 트러블 슈팅",
          tasks: [
            "SQL Injection, XSS 등 웹 취약점 방어 로직 수립",
            "Linux/Unix 서버 및 보안 장비(WAF, IPS) 운영",
            "DDoS 공격 대응 및 트래픽 분석을 통한 부하 분산 처리"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. Hero Section */}
      <section className="relative bg-slate-900 text-white py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-medium uppercase tracking-widest">
            Infra-Base Developer
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
             인프라의 바닥부터 이해하는<br/>
             <span className="text-blue-400">개발자</span>입니다.
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mt-4">
            시스템 운영과 보안 관제 경험을 바탕으로,<br/>
            안정적이고 견고한 서비스를 만드는 풀스택 개발자입니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-semibold text-white" onClick={() => navigate("/")}>
              포트폴리오 프로젝트 보기
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-slate-500 text-slate-200 hover:bg-slate-800 hover:text-white"
              onClick={() => window.open("https://github.com/SandwichCoffee/ReactProject/tree/main", "_blank")}
            >
              <Github className="mr-2 h-5 w-5" />
              GitHub 방문하기
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-10 mb-20 relative z-10">
        <Card className="shadow-xl">
          <CardContent className="p-8 md:p-12 space-y-8">
             <div className="flex flex-col md:flex-row gap-8 items-center border-b pb-8">
                <div className="w-32 h-32 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-4xl">
                    👨‍💻
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-bold">"Legacy를 Modern으로, 변화를 주도하다"</h3>
                  <p className="text-slate-600 leading-relaxed">
                    단순한 코딩을 넘어 <strong>'서비스가 실제 서버에서 어떻게 구동되고, 어떤 보안 위협에 노출되는지'</strong>를 체득했습니다.
                    과거 보안 관제 경험을 통해 트러블 슈팅 능력을 키웠으며, 현재는 레거시 시스템을 모던 웹 환경으로 전환하며 사용자 경험과 시스템 안정성을 동시에 높이는 데 주력하고 있습니다.
                  </p>
                </div>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                   <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Server size={18}/> 운영을 아는 개발자</h4>
                   <p className="text-slate-600 text-sm">
                     보안 엔지니어 관점에서 잠재적 위험을 차단하고, 운영 엔지니어의 마음으로 유지보수가 쉬운 코드를 작성하여 무중단 서비스를 지향합니다.
                   </p>
                </div>
                <div>
                   <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Layout size={18}/> 사용자 중심 설계</h4>
                   <p className="text-slate-600 text-sm">
                     Nexacro to React 마이그레이션을 주도하며 C/S 환경의 비효율적 로직을 개선하고, 웹 표준에 맞는 최적의 UX를 제공합니다.
                   </p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Work Experience */}
      <section className="max-w-4xl mx-auto px-6 mb-24 space-y-12">
        <div className="text-center space-y-2">
           <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>
           <p className="text-slate-500">주요 경력 사항입니다.</p>
        </div>

        <div className="space-y-8">
           {experience.map((exp, idx) => (
             <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
               <div className="bg-slate-50 p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{exp.company}</h3>
                    <p className="text-blue-600 font-medium">{exp.role}</p>
                  </div>
                  <Badge variant="outline" className="bg-white">{exp.period}</Badge>
               </div>
               <CardContent className="p-6 space-y-6">
                 {exp.details.map((detail, i) => (
                   <div key={i} className="space-y-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        • {detail.project}
                      </h4>
                      <p className="text-sm text-slate-500">{detail.desc}</p>
                      <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pl-2">
                        {detail.tasks.map((task, t) => (
                          <li key={t}>{task}</li>
                        ))}
                      </ul>
                   </div>
                 ))}
               </CardContent>
             </Card>
           ))}
        </div>
      </section>

      {/* 4. Skills */}
      <section className="max-w-4xl mx-auto px-6 mb-24 space-y-12">
        <div className="text-center space-y-2">
           <h2 className="text-3xl font-bold tracking-tight">Technical Skills</h2>
           <p className="text-slate-500">보유 기술 스택입니다.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <Card className="border-t-4 border-t-red-500 hover:shadow-lg transition-shadow">
             <CardHeader>
               <CardTitle className="flex items-center gap-2"><Server size={20}/> Backend & Infra</CardTitle>
             </CardHeader>
             <CardContent className="flex flex-wrap gap-2">
               {skills.backend.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
               <Badge variant="secondary">Linux/Unix</Badge>
               <Badge variant="secondary">WAF/IPS</Badge>
             </CardContent>
           </Card>

           <Card className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
             <CardHeader>
               <CardTitle className="flex items-center gap-2"><Layout size={20}/> Frontend</CardTitle>
             </CardHeader>
             <CardContent className="flex flex-wrap gap-2">
               {skills.frontend.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
               <Badge variant="secondary">Vue.js</Badge>
               <Badge variant="secondary">Nexacro N</Badge>
             </CardContent>
           </Card>

           <Card className="border-t-4 border-t-green-500 hover:shadow-lg transition-shadow">
             <CardHeader>
               <CardTitle className="flex items-center gap-2"><Terminal size={20}/> Tools</CardTitle>
             </CardHeader>
             <CardContent className="flex flex-wrap gap-2">
               {skills.tools.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
             </CardContent>
           </Card>
        </div>
      </section>

      {/* 5. Contact / Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center space-y-6">
         <h2 className="text-2xl font-bold text-white">Let's work together!</h2>
         <p>운영팀이 편안해할 수 있는 안정적인 시스템을 구축하겠습니다.</p>
         
         <div className="flex flex-col md:flex-row justify-center gap-6 pt-4 items-center">
            {/* Email Copy Component */}
            <div className="flex items-center gap-3 bg-slate-800 px-5 py-3 rounded-full hover:bg-slate-700 transition-colors cursor-pointer group"
                 onClick={() => {
                   navigator.clipboard.writeText("giveshajob@gmail.com");
                   toast.success("이메일 주소가 복사되었습니다!");
                 }}
            >
               <Mail size={20} className="text-blue-400" /> 
               <span className="text-white">giveshajob@gmail.com</span>
               <Copy size={16} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
            </div>

            <a href="tel:010-5709-2772" className="flex items-center gap-3 bg-slate-800 px-5 py-3 rounded-full hover:bg-slate-700 transition-colors">
               <Phone size={20} className="text-green-400" /> 
               <span className="text-white">010-5709-2772</span>
            </a>
         </div>

         <Separator className="bg-slate-800 my-8 w-24 mx-auto" />
         
         <p className="text-xs">
           © 2026 Developer Portfolio. All rights reserved.
         </p>
      </footer>
    </div>
  );
}
