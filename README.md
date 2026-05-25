# �festival SPOT Festival Korea

대한민국 전국 축제 정보를 지도 기반으로 제공하고, AI로 맞춤형 여행 코스를 플래닝할 수 있는 웹 서비스

---

## 🛠 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | React (Vite), HTML, CSS, JavaScript |
| Backend | Spring Boot 3.4.x (Java 17) |
| Database | MySQL 8.x |
| 버전 관리 | Git / GitHub |

---

## 📁 프로젝트 구조

```
SPOT-Festival/
├── frontend/   # React + Vite
├── backend/    # Spring Boot
└── README.md
```

---

## 🚀 시작하기

### 사전 설치 목록

| 항목 | 버전 | 다운로드 |
|---|---|---|
| Git | 최신 | https://git-scm.com |
| Node.js | LTS (v18+) | https://nodejs.org |
| JDK | 17 | https://adoptium.net |
| MySQL | 8.x | https://dev.mysql.com/downloads/installer |
| VS Code | 최신 | https://code.visualstudio.com |

---

### 1단계 — Git 설정

```bash
git config --global user.name "본인이름"
git config --global user.email "GitHub이메일"
git config --global core.autocrlf false
```

---

### 2단계 — 레포 Clone

```bash
git clone https://github.com/팀명/SPOT-Festival.git
cd SPOT-Festival
```

---

### 3단계 — 프론트엔드 세팅

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속 확인

---

### 4단계 — 백엔드 세팅

**① MySQL DB 생성**

```sql
CREATE DATABASE spotdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**② application.yml 생성**

`backend/src/main/resources/` 경로에서
`application.yml.example` 파일을 복사해 `application.yml`로 이름 변경 후 본인 DB 정보 입력

**③ VS Code 확장 프로그램 설치**

VS Code Extensions (Ctrl+Shift+X) 에서 아래 4개 검색 후 설치:

- `Extension Pack for Java`
- `Spring Boot Extension Pack`
- `Lombok Annotations Support`
- `MySQL` (by cweijan)

**④ 백엔드 실행**

```bash
cd backend
./mvnw spring-boot:run
```

브라우저에서 `http://localhost:8080/health` 접속 후 아래 텍스트 확인:

```
SPOT Backend is running!
```

---

## 👥 팀원 체크리스트

```
□ Git 설치 및 전역 설정 완료
□ 레포 clone 완료
□ feature 브랜치 이동 확인
□ Node.js 설치 → npm install → npm run dev → localhost:5173 확인
□ JDK 17 설치 확인 (java -version)
□ MySQL 설치 → spotdb 데이터베이스 생성
□ application.yml 작성 완료
□ ./mvnw spring-boot:run → localhost:8080/health 확인
□ VS Code 확장 프로그램 4개 설치 완료
```

---

## 🌿 브랜치 전략

```
main        ← 통합
feature/*   ← 기능 개발
```

**브랜치 네이밍 규칙:**

```
feature/홈-페이지
feature/지도-컴포넌트
feature/축제-상세-API
feature/AI-코스-빌더
```

---

## 📅 매일 작업 흐름

```bash
# 1. 작업 시작 전 항상 최신 받기
git pull origin main

# 2. 내 기능 브랜치 생성
git checkout -b feature/기능이름

# 3. 작업 후 커밋
git add .
git commit -m "feat: 기능 설명"
git push --set-upstream origin feature/기능이름

# 4. GitHub에서 Pull Request 생성 → 팀원 확인 후 merge
```
```
