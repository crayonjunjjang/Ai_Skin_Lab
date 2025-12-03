# 🩺 AI 피부 진단 시스템 (AI Skin Diagnosis System)

> 딥러닝 기반 피부 질환 분석 및 맞춤형 스킨케어 솔루션 제공 플랫폼

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.0+-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)](https://reactjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.0+-FF6F00.svg)](https://www.tensorflow.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [AI 모델 정보](#-ai-모델-정보)
- [설치 및 실행](#-설치-및-실행)
- [API 문서](#-api-문서)
- [프로젝트 구조](#-프로젝트-구조)
- [스크린샷](#-스크린샷)
- [배포](#-배포)
- [기여 방법](#-기여-방법)
- [라이선스](#-라이선스)
- [팀 정보](#-팀-정보)

## 🎯 프로젝트 소개

**AI 피부 진단 시스템**은 딥러닝 기술을 활용하여 사용자가 업로드한 피부 이미지를 분석하고, 
6가지 피부 상태(여드름, 아토피, 건선, 주사, 지루성 피부염, 정상)를 진단하는 웹 애플리케이션입니다.

### 🌟 프로젝트의 가치

- **접근성**: 병원 방문 전 간편한 1차 피부 상태 확인
- **개인화**: 사용자의 피부 타입(지성/건성/복합성/민감성)에 맞춤화된 스킨케어 솔루션 제공
- **편의성**: 언제 어디서나 스마트폰으로 즉시 진단 가능
- **기록 관리**: 진단 이력을 저장하여 피부 상태 변화 추적 가능


## ✨ 주요 기능

### 1. 🔐 사용자 인증 시스템
- JWT 기반 회원가입 및 로그인
- 사용자 프로필 관리 (나이, 성별, 피부 타입)
- 비밀번호 변경 기능

### 2. 🤖 AI 피부 진단
- **6가지 피부 질환 분류**
  - 여드름 피부 (Acne)
  - 아토피 피부염 (Atopic Dermatitis)
  - 건선 (Psoriasis)
  - 주사 피부염 (Rosacea)
  - 지루성 피부염 (Seborrheic Dermatitis)
  - 정상 피부 (Normal)

- **실시간 이미지 분석**
  - 드래그 앤 드롭 이미지 업로드
  - 즉시 AI 분석 및 결과 제공
  - 신뢰도(Confidence) 기반 다중 진단 결과

### 3. 💡 맞춤형 스킨케어 솔루션
- 피부 타입별 맞춤 케어 가이드
- 질환별 상세 원인 분석
- 추천 성분 및 제품 타입 안내
- 생활 습관 개선 팁

### 4. 📊 진단 이력 관리
- 개인별 진단 기록 저장
- 날짜별 진단 결과 조회
- 이미지 및 솔루션 재확인
- 기록 삭제 기능

### 5. ⭐ 사용자 리뷰 시스템
- 5점 척도 평점 시스템
- 텍스트 리뷰 작성
- 홈페이지에 리뷰 표시

### 6. 🛡️ 관리자 대시보드
- 사용자 관리 (조회, 수정, 삭제)
- 진단 기록 모니터링
- 리뷰 관리 및 모더레이션


## 🛠 기술 스택

### Backend
- **Framework**: Django 4.x + Django REST Framework
- **AI/ML**: TensorFlow 2.x (CPU)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Image Processing**: Pillow
- **CORS**: django-cors-headers
- **Server**: Gunicorn

### Frontend
- **Framework**: React 18.x
- **UI Library**: React Bootstrap 5.x
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Notifications**: React Toastify
- **Icons**: React Bootstrap Icons

### AI Model
- **Architecture**: Convolutional Neural Network (CNN)
- **Input Size**: 125 x 100 x 3 (RGB)
- **Layers**:
  - Data Augmentation (RandomFlip, RandomRotation)
  - Rescaling (1./255)
  - Conv2D (32, 64, 128 filters)
  - MaxPooling2D
  - Flatten
  - Dense (128 units)
  - Dropout (0.5)
  - Output Dense (6 classes, softmax)
- **Optimizer**: Adam (learning_rate=0.00075)
- **Loss Function**: Sparse Categorical Crossentropy

### Database
- **Development**: SQLite3
- **Production**: PostgreSQL (권장)

### Deployment
- **Web Server**: Nginx
- **Process Manager**: systemd (Gunicorn service)
- **Static Files**: Nginx serving


## 🏗 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React Frontend (Port 3000)                  │   │
│  │  - React Router                                       │   │
│  │  - Axios HTTP Client                                  │   │
│  │  - Bootstrap UI Components                            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Django REST API (Port 8000)                    │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Authentication (JWT)                           │  │   │
│  │  │  - Token Generation & Validation                │  │   │
│  │  │  - User Registration & Login                    │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  API Endpoints                                  │  │   │
│  │  │  - /api/predict/      (AI Diagnosis)           │  │   │
│  │  │  - /api/history/      (Diagnosis History)      │  │   │
│  │  │  - /api/reviews/      (User Reviews)           │  │   │
│  │  │  - /api/profile/      (User Profile)           │  │   │
│  │  │  - /api/admin/*       (Admin Panel)            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       AI Model Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         TensorFlow CNN Model                          │   │
│  │  - Image Preprocessing (Resize, Normalize)           │   │
│  │  - Feature Extraction (Conv Layers)                  │   │
│  │  - Classification (6 Classes)                        │   │
│  │  - Confidence Score Calculation                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              SQLite / PostgreSQL                      │   │
│  │  - User (username, password, profile)                │   │
│  │  - Profile (age, gender, skin_type)                  │   │
│  │  - Diagnosis (user, image, result, timestamp)        │   │
│  │  - Review (user, rating, text, timestamp)            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              File Storage (Media)                     │   │
│  │  - /media/diagnoses/  (Uploaded Images)              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```


## 🧠 AI 모델 정보

### 모델 구조

```python
Model: Sequential
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
rescaling (Rescaling)        (None, 100, 125, 3)       0         
data_augmentation (Sequential) (None, 100, 125, 3)     0         
conv2d (Conv2D)              (None, 100, 125, 32)      896       
max_pooling2d (MaxPooling2D) (None, 50, 62, 32)        0         
conv2d_1 (Conv2D)            (None, 50, 62, 64)        18,496    
max_pooling2d_1 (MaxPooling2D) (None, 25, 31, 64)      0         
conv2d_2 (Conv2D)            (None, 25, 31, 128)       73,856    
max_pooling2d_2 (MaxPooling2D) (None, 12, 15, 128)     0         
flatten (Flatten)            (None, 23040)             0         
dense (Dense)                (None, 128)               2,949,248 
dropout (Dropout)            (None, 128)               0         
dense_1 (Dense)              (None, 6)                 774       
=================================================================
Total params: 3,043,270
Trainable params: 3,043,270
Non-trainable params: 0
```

### 진단 프로세스

1. **이미지 전처리**
   - 입력 이미지를 125x100 픽셀로 리사이즈
   - RGB 채널로 변환
   - 픽셀 값 정규화 (0-1 범위)

2. **AI 예측**
   - CNN 모델을 통한 특징 추출
   - Softmax 활성화 함수로 각 클래스별 확률 계산
   - 신뢰도 10% 이상인 상위 3개 결과 반환

3. **맞춤형 솔루션 생성**
   - 사용자 피부 타입 확인 (지성/건성/복합성/민감성/일반)
   - 진단된 질환과 피부 타입 조합으로 최적 솔루션 매칭
   - 원인 분석, 추천 제품, 생활 팁 제공

### 진단 가능한 피부 상태

| 클래스 | 설명 | 주요 특징 |
|--------|------|-----------|
| 여드름 피부 | 모공 막힘으로 인한 염증성 피부 질환 | 붉은 구진, 농포, 피지 과다 |
| 아토피 피부염 | 만성 염증성 피부 질환 | 심한 가려움, 건조함, 피부 장벽 손상 |
| 건선 | 은백색 각질을 동반한 만성 피부 질환 | 붉은 반점, 두꺼운 각질층 |
| 주사 피부염 | 얼굴 중앙부 홍조 및 혈관 확장 | 지속적인 붉어짐, 혈관 확장 |
| 지루성 피부염 | 피지선이 많은 부위의 습진성 피부염 | 기름진 각질, 두피/얼굴 T존 발생 |
| 정상 피부 | 특별한 질환이 없는 건강한 피부 | 균형 잡힌 유수분, 트러블 없음 |


## 🚀 설치 및 실행

### 사전 요구사항

- Python 3.8 이상
- Node.js 14.x 이상
- npm 또는 yarn

### 1. 저장소 클론

```bash
git clone https://github.com/yourusername/ai-skin-diagnosis.git
cd ai-skin-diagnosis
```

### 2. Backend 설정

```bash
# 백엔드 디렉토리로 이동
cd backend

# 가상환경 생성 (선택사항이지만 권장)
python -m venv venv

# 가상환경 활성화
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 의존성 패키지 설치
pip install -r requirements.txt

# 데이터베이스 마이그레이션
python manage.py makemigrations
python manage.py migrate

# 관리자 계정 생성 (선택사항)
python manage.py createsuperuser

# 개발 서버 실행
python manage.py runserver
```

Backend 서버가 `http://localhost:8000`에서 실행됩니다.

### 3. Frontend 설정

```bash
# 새 터미널을 열고 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 패키지 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm start
# 또는
yarn start
```

Frontend 서버가 `http://localhost:3000`에서 실행됩니다.

### 4. 환경 변수 설정 (선택사항)

Backend의 `settings.py`에서 다음 설정을 확인하세요:

```python
# CORS 설정
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# JWT 설정
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# 미디어 파일 설정
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```


## 📡 API 문서

### Authentication

#### 회원가입
```http
POST /api/register/
Content-Type: application/json

{
  "username": "testuser",
  "password": "securepassword",
  "age": 25,
  "gender": "M",
  "skin_type": "oily"
}
```

#### 로그인
```http
POST /api/token/
Content-Type: application/json

{
  "username": "testuser",
  "password": "securepassword"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### AI Diagnosis

#### 피부 진단
```http
POST /api/predict/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

image: [이미지 파일]
is_example: false

Response:
{
  "predictions": [
    {
      "label": "여드름 피부",
      "confidence": 85.42
    },
    {
      "label": "지루 피부",
      "confidence": 12.33
    }
  ],
  "tips": [
    "**AI 진단:** 여드름",
    "**피부 타입:** 지성",
    "**원인 분석:** 과다한 피지 분비로...",
    "**추천 솔루션:** BHA 성분이 포함된...",
    "**생활 팁:** 기름진 음식과 당분..."
  ]
}
```

### User Profile

#### 프로필 조회
```http
GET /api/profile/
Authorization: Bearer {access_token}

Response:
{
  "username": "testuser",
  "profile": {
    "age": 25,
    "gender": "M",
    "skin_type": "oily"
  }
}
```

#### 프로필 수정
```http
PUT /api/profile/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "username": "testuser",
  "profile": {
    "age": 26,
    "gender": "M",
    "skin_type": "combination"
  }
}
```

### Diagnosis History

#### 진단 기록 조회
```http
GET /api/history/?page=1
Authorization: Bearer {access_token}

Response:
{
  "count": 15,
  "next": "http://localhost:8000/api/history/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "image": "/media/diagnoses/image.jpg",
      "result": {
        "predictions": [...],
        "tips": [...]
      },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 진단 기록 삭제
```http
DELETE /api/history/{id}/
Authorization: Bearer {access_token}
```

### Reviews

#### 리뷰 목록 조회
```http
GET /api/reviews/

Response:
[
  {
    "id": 1,
    "user": {
      "username": "testuser"
    },
    "rating": 5,
    "text": "정말 유용한 서비스입니다!",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

#### 리뷰 작성
```http
POST /api/reviews/create/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "rating": 5,
  "text": "정말 유용한 서비스입니다!"
}
```

### Admin Endpoints

관리자 권한이 필요한 엔드포인트:

- `GET /api/admin/users/` - 사용자 목록
- `GET /api/admin/reviews/` - 리뷰 목록
- `GET /api/admin/diagnoses/` - 진단 기록 목록
- `PUT /api/admin/users/{id}/` - 사용자 수정
- `DELETE /api/admin/users/{id}/` - 사용자 삭제


## 📁 프로젝트 구조

```
ai-skin-diagnosis/
│
├── backend/                          # Django Backend
│   ├── api/                          # Main API Application
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── seed_reviews.py   # 리뷰 시드 데이터
│   │   ├── migrations/               # 데이터베이스 마이그레이션
│   │   ├── admin.py                  # Django Admin 설정
│   │   ├── models.py                 # 데이터 모델 (User, Profile, Diagnosis, Review)
│   │   ├── serializers.py            # DRF Serializers
│   │   ├── views.py                  # API Views & AI 예측 로직
│   │   └── urls.py                   # API URL 라우팅
│   │
│   ├── backend_project/              # Django 프로젝트 설정
│   │   ├── settings.py               # 프로젝트 설정
│   │   ├── urls.py                   # 메인 URL 설정
│   │   └── wsgi.py                   # WSGI 설정
│   │
│   ├── model/                        # AI 모델 파일
│   │   ├── keras.h5                  # 학습된 CNN 모델
│   │   └── labels.txt                # 클래스 레이블
│   │
│   ├── media/                        # 업로드된 이미지 저장
│   │   └── diagnoses/
│   │
│   ├── db.sqlite3                    # SQLite 데이터베이스
│   ├── manage.py                     # Django 관리 스크립트
│   └── requirements.txt              # Python 의존성
│
├── frontend/                         # React Frontend
│   ├── public/                       # 정적 파일
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js              # Axios 인스턴스 설정
│   │   │
│   │   ├── assets/                   # 이미지 및 아이콘
│   │   │   ├── icon-ai.svg
│   │   │   ├── icon-upload.svg
│   │   │   └── test*.jpg             # 예제 이미지
│   │   │
│   │   ├── components/               # React 컴포넌트
│   │   │   ├── admin/                # 관리자 컴포넌트
│   │   │   │   ├── UserManagement.js
│   │   │   │   ├── ReviewManagement.js
│   │   │   │   └── DiagnosisManagement.js
│   │   │   ├── AdminRoute.js         # 관리자 라우트 보호
│   │   │   ├── DiagnosisPage.js      # AI 진단 페이지
│   │   │   ├── HomePage.js           # 홈페이지
│   │   │   ├── LoginPage.js          # 로그인
│   │   │   ├── RegisterPage.js       # 회원가입
│   │   │   ├── MyPage.js             # 진단 기록
│   │   │   ├── ProfilePage.js        # 프로필 관리
│   │   │   ├── ReviewForm.js         # 리뷰 작성 폼
│   │   │   └── Navbar.js             # 네비게이션 바
│   │   │
│   │   ├── layouts/
│   │   │   └── AdminLayout.js        # 관리자 레이아웃
│   │   │
│   │   ├── App.js                    # 메인 App 컴포넌트
│   │   ├── App.css                   # 스타일
│   │   └── index.js                  # 엔트리 포인트
│   │
│   ├── package.json                  # npm 의존성
│   └── package-lock.json
│
├── config/                           # 배포 설정
│   ├── nginx/
│   │   └── skin-diagnosis-app        # Nginx 설정
│   └── systemd/
│       └── gunicorn.service          # Gunicorn 서비스
│
├── .gitignore
└── README.md                         # 프로젝트 문서
```


## 📸 스크린샷

### 홈페이지
메인 랜딩 페이지로 서비스 소개, 작동 방식, 사용자 리뷰를 확인할 수 있습니다.
![alt text](image.png)
### 회원가입
사용자 정보(아이디, 비밀번호)와 피부 정보(나이, 성별, 피부 타입)를 입력하여 가입합니다.
![alt text](image-1.png)
### AI 진단 페이지
- 드래그 앤 드롭 또는 클릭으로 이미지 업로드
- 예제 이미지로 빠른 테스트 가능
- 실시간 AI 분석 및 결과 표시
- 신뢰도 기반 다중 진단 결과
- 피부 타입별 맞춤 스킨케어 솔루션 제공
![alt text](image-2.png)
![alt text](image-3.png)
### 진단 기록 (마이페이지)
- 과거 진단 이력을 카드 형태로 표시
- 날짜, 이미지, 진단 결과, 솔루션 확인
- 페이지네이션으로 편리한 탐색
- 기록 삭제 기능
![alt text](image-4.png)
### 프로필 관리
- 사용자 정보 수정
- 피부 타입 변경
- 비밀번호 변경
![alt text](image-5.png)
### 관리자 대시보드
- 사용자 관리 (조회, 수정, 삭제)
- 진단 기록 모니터링
- 리뷰 관리
![alt text](image-6.png)

## 🌐 배포

### Production 환경 설정

#### 1. Backend 배포 (Gunicorn + Nginx)

**Gunicorn 설정** (`/etc/systemd/system/gunicorn.service`):
```ini
[Unit]
Description=gunicorn daemon for skin diagnosis app
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/path/to/backend
ExecStart=/path/to/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/path/to/backend/gunicorn.sock \
          backend_project.wsgi:application

[Install]
WantedBy=multi-user.target
```

**Nginx 설정** (`/etc/nginx/sites-available/skin-diagnosis-app`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        alias /path/to/backend/staticfiles/;
    }
    
    location /media/ {
        alias /path/to/backend/media/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/path/to/backend/gunicorn.sock;
    }
}
```

**서비스 시작**:
```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl restart nginx
```

#### 2. Frontend 배포

**빌드**:
```bash
cd frontend
npm run build
```

빌드된 파일(`build/` 디렉토리)을 Nginx로 서빙하거나, 
Netlify, Vercel 등의 정적 호스팅 서비스에 배포할 수 있습니다.

**Nginx 설정 (React 라우팅 지원)**:
```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;
    root /path/to/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. 환경 변수 설정

**Backend (`settings.py`)**:
```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', 'www.your-domain.com']

# 보안 설정
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# 데이터베이스 (PostgreSQL 권장)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': '5432',
    }
}
```

**Frontend (`.env.production`)**:
```
REACT_APP_API_URL=https://api.your-domain.com
```


## 🔒 보안 고려사항

### 인증 및 권한
- JWT 토큰 기반 인증 시스템
- Access Token (60분) + Refresh Token (1일) 구조
- 관리자 전용 엔드포인트 권한 검증

### 데이터 보호
- 비밀번호 해싱 (Django의 PBKDF2 알고리즘)
- CORS 설정으로 허용된 도메인만 API 접근 가능
- CSRF 토큰 검증

### 파일 업로드 보안
- 이미지 파일 타입 검증
- 파일 크기 제한
- 안전한 파일명 처리

### Production 보안 체크리스트
- [ ] `DEBUG = False` 설정
- [ ] `SECRET_KEY` 환경 변수로 관리
- [ ] HTTPS 적용 (SSL/TLS 인증서)
- [ ] 데이터베이스 접근 제한
- [ ] 정기적인 의존성 패키지 업데이트
- [ ] 로그 모니터링 설정


## 🧪 테스트

### Backend 테스트

```bash
cd backend
python manage.py test
```

### Frontend 테스트

```bash
cd frontend
npm test
```

### 테스트 커버리지

주요 테스트 영역:
- API 엔드포인트 테스트
- 모델 유효성 검증
- 인증 및 권한 테스트
- AI 모델 예측 테스트
- 컴포넌트 렌더링 테스트


## 🐛 알려진 이슈 및 제한사항

### 현재 제한사항
1. **AI 모델 정확도**: 현재 모델은 학습 데이터셋에 따라 정확도가 제한될 수 있습니다.
2. **이미지 품질**: 저화질 이미지나 조명이 불량한 이미지는 진단 정확도가 낮을 수 있습니다.
3. **의료적 한계**: 본 시스템은 의료 기기가 아니며, 전문의 진단을 대체할 수 없습니다.

### 향후 개선 계획
- [ ] 더 큰 데이터셋으로 모델 재학습
- [ ] 추가 피부 질환 클래스 확장
- [ ] 모바일 앱 개발
- [ ] 다국어 지원
- [ ] 실시간 채팅 상담 기능
- [ ] 피부과 전문의 연결 서비스
- [ ] 진단 결과 PDF 다운로드
- [ ] 소셜 로그인 (Google, Kakao, Naver)


## 🤝 기여 방법

프로젝트에 기여하고 싶으신가요? 환영합니다!

### 기여 프로세스

1. **Fork** 이 저장소를 Fork 합니다.
2. **Branch** 새로운 기능 브랜치를 생성합니다.
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** 변경사항을 커밋합니다.
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** 브랜치에 푸시합니다.
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Pull Request** Pull Request를 생성합니다.

### 코드 스타일

- **Python**: PEP 8 스타일 가이드 준수
- **JavaScript**: ESLint 설정 준수
- **Commit Message**: 명확하고 설명적인 커밋 메시지 작성


## 👥 팀 정보

### 개발팀

이 프로젝트는 MEGANEXT 부트캠프에서 개발되었습니다.


## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- [Django](https://www.djangoproject.com/) - 강력한 Python 웹 프레임워크
- [React](https://reactjs.org/) - 사용자 인터페이스 구축 라이브러리
- [TensorFlow](https://www.tensorflow.org/) - 머신러닝 프레임워크
- [Bootstrap](https://getbootstrap.com/) - UI 컴포넌트 라이브러리
- [React Bootstrap](https://react-bootstrap.github.io/) - React용 Bootstrap 컴포넌트

## ⚠️ 면책 조항

**중요**: 본 AI 피부 진단 시스템은 교육 및 참고 목적으로 개발되었습니다.

- 본 서비스의 진단 결과는 의학적 조언, 진단 또는 치료를 대체할 수 없습니다.
- 피부 질환이 의심되거나 증상이 지속되는 경우, 반드시 피부과 전문의와 상담하시기 바랍니다.
- 본 서비스 사용으로 인한 어떠한 결과에 대해서도 개발팀은 책임을 지지 않습니다.
- AI 모델의 예측은 학습 데이터에 기반하며, 100% 정확성을 보장하지 않습니다.

---

<div align="center">

**AI 피부 진단 시스템으로 더 건강한 피부를 만들어가세요! 🌟**

Made with ❤️ by AI Skin Diagnosis Team

[⬆ 맨 위로 돌아가기](#-ai-피부-진단-시스템-ai-skin-diagnosis-system)

</div>
