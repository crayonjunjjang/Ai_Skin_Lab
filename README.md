# AI 피부 질환 진단 웹 애플리케이션

피부 이미지를 업로드하여 AI 기반으로 피부 질환을 진단하는 풀스택 웹 애플리케이션입니다.

## 📖 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [프로젝트 구조](#-프로젝트-구조)
- [로컬 환경에서 실행하기](#-로컬-환경에서-실행하기)
- [배포](#-배포)
- [AI 모델](#-ai-모델)

## ✨ 주요 기능

- **사용자 인증**: 회원가입 및 로그인 기능
- **AI 피부 진단**: 피부 이미지를 업로드하여 AI 모델을 통해 진단 결과 확인
- **진단 기록**: 사용자의 이전 진단 기록 조회
- **리뷰 작성**: 서비스에 대한 리뷰 작성 및 조회
- **관리자 페이지**: 사용자, 진단 기록, 리뷰 데이터 관리

## 💻 기술 스택

| 구분 | 기술 |
| --- | --- |
| **Frontend** | React, React Router, Axios, Bootstrap |
| **Backend** | Django, Django REST Framework, Simple JWT |
| **Database** | SQLite (기본) |
| **AI** | TensorFlow, Keras |
| **Deployment** | AWS EC2, Nginx, Gunicorn, Let's Encrypt (Certbot) |

## 🏗️ 시스템 아키텍처

사용자 요청은 다음과 같은 흐름으로 처리됩니다.

1.  **사용자 (웹 브라우저)**: 웹사이트에 접속하여 이미지 업로드 등 요청 발생
2.  **Nginx**: 웹 서버. 사용자의 요청을 가장 먼저 받음.
    -   API 요청 (`/api/*`)은 Gunicorn으로 전달 (리버스 프록시)
    -   정적 파일(React 빌드 파일, 이미지 등)은 직접 서빙
3.  **Gunicorn**: WSGI 서버. Nginx로부터 받은 요청을 Django 애플리케이션에 전달.
4.  **Django**: 백엔드 프레임워크. 비즈니스 로직 처리, AI 모델 추론 실행, 데이터베이스와 통신.
5.  **React**: 프론트엔드 라이브러리. 사용자 인터페이스(UI)를 렌더링하고 서버와 API 통신.

## 📂 프로젝트 구조

```
.
├── backend/      # Django 백엔드
│   ├── api/          # Django REST Framework API 앱
│   ├── model/        # Keras 모델 파일 (keras.h5, labels.txt)
│   ├── manage.py
│   └── requirements.txt
├── frontend/     # React 프론트엔드
│   ├── src/
│   ├── public/
│   └── package.json
├── config/       # 서버 배포 설정 파일
│   ├── nginx/
│   └── systemd/
└── README.md
```

## 🚀 로컬 환경에서 실행하기

### 사전 준비

- Node.js & npm
- Python & pip

### 1. Backend 실행

```bash
# 1. 백엔드 디렉토리로 이동
cd backend

# 2. 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. 의존성 설치
pip install -r requirements.txt

# 4. 데이터베이스 마이그레이션
python manage.py migrate

# 5. 백엔드 서버 실행
python manage.py runserver
```

### 2. Frontend 실행

```bash
# 1. 프론트엔드 디렉토리로 이동
cd frontend

# 2. 의존성 설치
npm install

# 3. 프론트엔드 개발 서버 실행
npm start
```

## ☁️ 배포

이 프로젝트는 AWS EC2 (Ubuntu) 환경에 배포되었습니다. 주요 구성 요소는 다음과 같습니다.

-   **Nginx**: 리버스 프록시 및 정적 파일 서빙.
-   **Gunicorn**: Django 애플리케이션을 위한 WSGI 서버.
-   **Certbot**: Let's Encrypt를 통해 SSL 인증서를 발급하고 HTTPS를 적용.

상세한 서버 설정은 `config/` 디렉토리에 있는 Nginx 및 systemd 서비스 파일을 참고하세요.

## 🤖 AI 모델

-   **학습**: Google Colab 환경에서 이미지 분류 모델을 학습했습니다.
-   **모델**: TensorFlow와 Keras를 사용하여 구축되었으며, 학습된 가중치는 `backend/model/keras.h5` 파일에 저장되어 있습니다.
-   **클래스**: 피부 질환 클래스 정보는 `backend/model/labels.txt` 파일에 정의되어 있습니다.
