import os
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Rescaling, RandomFlip, RandomRotation
from tensorflow.keras.optimizers import Adam

from django.contrib.auth.models import User
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer, DiagnosisSerializer, ReviewSerializer, UserSerializerForProfile, ChangePasswordSerializer, UserAdminSerializer, ReviewAdminSerializer, DiagnosisAdminSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from PIL import Image
import numpy as np

# --- 1. 기본 파라미터 및 모델 로드 --- (학습 코드 기반으로 재구성)
IMAGE_HEIGHT = 100
IMAGE_WIDTH = 125
CHANNELS = 3

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'keras.h5')
LABELS_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'labels.txt')

model = None
labels = None
num_classes = 0

try:
    with open(LABELS_PATH, 'r', encoding='utf-8') as f:
        labels = [line.strip() for line in f.readlines()]
    num_classes = len(labels)

    data_augmentation = Sequential(
      [
        RandomFlip("horizontal"),
        RandomRotation(0.1),
      ],
      name="data_augmentation"
    )

    model = Sequential([
        Input(shape=(IMAGE_HEIGHT, IMAGE_WIDTH, CHANNELS)),
        Rescaling(1./255),
        data_augmentation,
        Conv2D(32, (3, 3), activation='relu', padding='same'),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu', padding='same'),
        MaxPooling2D((2, 2)),
        Conv2D(128, (3, 3), activation='relu', padding='same'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dense(128, activation='relu'),
        Dropout(0.5),
        Dense(num_classes, activation='softmax')
    ])

    model.load_weights(MODEL_PATH)
    model.trainable = False
    model.compile(optimizer=Adam(learning_rate=0.00075), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

except Exception as e:
    model = None
    labels = None
    print(f"Error loading model or labels: {e}")


from .models import Diagnosis, Review

SKINCARE_TIPS = {
    "여드름 피부": {
        "oily": [
            "**AI 진단:** 여드름",
            "**피부 타입:** 지성",
            "**원인 분석:** 과다한 피지 분비로 모공이 막히고, 각질이 제대로 탈락하지 못해 염증이 발생하기 쉬운 상태입니다.",
            "**추천 솔루션:** BHA(살리실산) 성분이 포함된 클렌저를 사용하여 모공 속 피지와 각질을 관리하세요. 주 1-2회 클레이 마스크로 피지를 흡착해주는 것도 좋습니다. 논코메도제닉(Non-comedogenic) 오일프리 제품을 사용하세요.",
            "**생활 팁:** 기름진 음식과 당분 높은 음식 섭취를 줄이고, 얼굴을 만지는 습관을 피하세요. 충분한 수면은 필수입니다."
        ],
        "dry": [
            "**AI 진단:** 여드름",
            "**피부 타입:** 건성",
            "**원인 분석:** 피부 유수분 밸런스가 무너지고, 건조함으로 인해 각질이 쌓여 모공을 막아 트러블이 발생한 상태입니다.",
            "**추천 솔루션:** 강한 세정제 대신 순한 약산성 폼클렌저를 사용하세요. 각질 제거는 자극이 적은 PHA나 효소 클렌저를 활용하고, 세라마이드, 히알루론산 성분의 보습제로 피부 장벽을 강화해야 합니다.",
            "**생활 팁:** 보습제를 충분히 발라 피부를 촉촉하게 유지하고, 실내 습도를 적절히 조절해주세요. 알코올이 함유된 토너는 피하는 것이 좋습니다."
        ],
        "combination": [
            "**AI 진단:** 여드름",
            "**피부 타입:** 복합성",
            "**원인 분석:** T존(이마, 코)의 과다 피지와 U존(볼, 턱)의 건조함이 복합적으로 작용하여 트러블이 발생하는 상태입니다.",
            "**추천 솔루션:** T존에는 BHA 성분의 제품을, U존에는 수분감이 풍부한 제품을 사용하는 등 부위별 케어(Zonal Care)가 효과적입니다. 티트리 오일이나 시카 성분의 스팟 제품으로 트러블 부위를 관리하세요.",
            "**생활 팁:** 전체적으로 유분감이 많은 제품보다는 가벼운 젤이나 로션 타입의 수분 제품을 사용하고, 주기적으로 각질을 관리해주세요."
        ],
        "sensitive": [
            "**AI 진단:** 여드름",
            "**피부 타입:** 민감성",
            "**원인 분석:** 외부 자극에 의해 피부 장벽이 손상되고, 작은 자극에도 쉽게 염증 반응을 일으켜 트러블이 발생하는 상태입니다.",
            "**추천 솔루션:** 최대한 자극이 적은 제품을 선택하세요. 병풀추출물(시카), 알란토인 등 진정 성분이 함유된 제품으로 피부를 보호하고, 새로운 제품 사용 전 반드시 패치 테스트를 진행하세요. 물리적 각질 제거는 피해야 합니다.",
            "**생활 팁:** 스트레스 관리와 함께, 자외선 차단제를 꼼꼼히 발라 피부를 보호해주세요. 성분 목록이 단순한 제품을 선택하는 것이 좋습니다."
        ],
        "default": [
            "**AI 진단:** 여드름",
            "**피부 타입:** 일반",
            "**원인 분석:** 호르몬 변화, 스트레스, 잘못된 식습관 등 다양한 요인으로 인해 일시적인 트러블이 발생할 수 있습니다.",
            "**추천 솔루션:** 자극이 적은 약산성 클렌저를 사용하고, 트러블 부위에는 티트리 오일 등 스팟 케어 제품을 사용해 보세요.",
            "**생활 팁:** 턱이나 손으로 얼굴을 만지는 습관을 줄이고, 침구류를 청결하게 관리하는 것이 중요합니다."
        ]
    },
    "정상 피부": {
        "default": [
            "**AI 진단:** 양호",
            "**분석:** 특별한 피부 질환 없이 건강한 상태입니다. 축하합니다!",
            "**유지 팁:** 현재의 건강한 상태를 유지하기 위해 기본적인 클렌징과 보습에 충실하고, 자외선 차단제를 매일 사용하는 습관을 들이세요.",
            "**추가 관리:** 계절 변화나 컨디션에 따라 건조함이나 유분이 느껴질 때 그에 맞는 수분/진정 팩을 사용해주면 좋습니다."
        ]
    },
    "건선 피부": {
        "oily": [
            "**AI 진단:** 건선",
            "**피부 타입:** 지성",
            "**분석:** 피부 자체는 건조하고 각질이 문제지만, 두피나 얼굴 등 피지선이 발달한 곳에서는 지성 트러블이 동반될 수 있습니다.",
            "**추천 솔루션:** 각질을 억지로 제거하지 말고, 가벼운 제형의 보습제를 사용하여 피부를 유연하게 만드세요. 살리실산(BHA) 성분은 건선에 도움이 될 수 있으나, 자극이 느껴지면 사용을 중단해야 합니다.",
            "**생활 팁:** 스트레스 관리가 매우 중요하며, 금주, 금연을 실천하세요. 오메가-3가 풍부한 음식이 도움이 될 수 있습니다."
        ],
        "dry": [
            "**AI 진단:** 건선",
            "**피부 타입:** 건성",
            "**분석:** 피부가 매우 건조하여 각질층이 두꺼워지고, 붉은 반점과 가려움증이 심하게 나타나는 상태입니다.",
            "**추천 솔루션:** 바셀린, 시어버터, 세라마이드 등 고보습 성분이 함유된 매우 리치한 크림이나 연고 타입의 보습제를 사용하세요. 목욕 후 3분 이내에 전신에 보습제를 바르는 것이 핵심입니다.",
            "**생활 팁:** 피부에 상처가 나지 않도록 주의하고, 때를 미는 등 피부에 자극을 주는 행위를 피해야 합니다. 증상이 심하면 반드시 전문의와 상담하세요."
        ],
        "default": [
            "**AI 진단:** 건선",
            "**분석:** 피부에 붉은 반점과 함께 은백색의 각질이 나타나는 만성 피부 질환일 수 있습니다.",
            "**추천 솔루션:** 피부를 항상 촉촉하게 유지하는 것이 매우 중요합니다. 목욕 후 3분 이내에 자극 없는 고보습 크림을 전신에 발라주세요.",
            "**생활 팁:** 스트레스 관리와 함께 금주, 금연을 실천하고, 피부에 상처가 나지 않도록 주의해야 합니다. 증상이 심할 경우 반드시 전문의와 상담하세요."
        ]
    },
    "아토피 피부": {
        "oily": [
            "**AI 진단:** 아토피 피부염",
            "**피부 타입:** 지성",
            "**분석:** 피부 장벽이 약해 외부 자극에 민감하지만, 유분도 함께 분비되는 복합적인 상태일 수 있습니다.",
            "**추천 솔루션:** 가벼운 젤이나 로션 타입의 저자극 보습제를 사용하여 피부 장벽을 보호하세요. 논코메도제닉(Non-comedogenic) 제품을 선택하여 모공 막힘을 방지하는 것이 중요합니다.",
            "**생활 팁:** 오일프리(Oil-free) 제품을 사용하고, 잦은 세안보다는 순한 클렌저로 아침, 저녁 세안하는 습관을 유지하세요."
        ],
        "dry": [
            "**AI 진단:** 아토피 피부염",
            "**피부 타입:** 건성",
            "**분석:** 피부의 유수분 부족과 함께 피부 장벽 기능이 심하게 저하되어 극심한 건조함과 가려움증을 유발하는 상태입니다.",
            "**추천 솔루션:** 세라마이드, 판테놀 등 피부 장벽 강화 성분이 고농축된 리치한 크림 타입의 보습제를 수시로 덧발라주세요. 샤워나 세안 후 3분 이내에 보습제를 바르는 것이 가장 효과적입니다.",
            "**생활 팁:** 가습기를 사용하여 실내 습도를 50-60%로 유지하고, 뜨거운 물 샤워는 피해주세요. 보습력이 좋은 입욕제를 사용하는 것도 도움이 됩니다."
        ],
        "sensitive": [
            "**AI 진단:** 아토피 피부염",
            "**피부 타입:** 민감성",
            "**분석:** 아토피 피부염 자체가 매우 민감한 상태로, 작은 자극에도 쉽게 악화될 수 있습니다.",
            "**추천 솔루션:** 향료, 색소, 알코올 등 자극적인 성분이 완전히 배제된 제품을 사용하세요. 물리적 자극을 최소화하기 위해 부드럽게 펴 바르고, 진정 성분(예: 판테놀, 마데카소사이드)이 포함된 제품을 선택하세요.",
            "**생활 팁:** 면 소재의 부드러운 옷을 착용하고, 손톱을 짧게 깎아 긁어서 생기는 2차 감염을 예방하세요. 새로운 음식 섭취 시 알레르기 반응을 주의 깊게 관찰하세요."
        ],
        "default": [
            "**AI 진단:** 아토피 피부염",
            "**분석:** 심한 가려움증을 동반하는 만성적인 피부 염증 질환일 수 있습니다.",
            "**추천 솔루션:** 피부 장벽을 강화하는 세라마이드 성분의 보습제를 하루 2-3회 이상 충분히 사용해주세요. 순한 약산성 클렌저로 짧게 샤워하는 것이 좋습니다.",
            "**생활 팁:** 실내 온도와 습도를 적절히 유지하고, 긁지 않도록 손톱을 짧게 관리하세요. 면 소재의 부드러운 옷을 착용하는 것이 도움이 됩니다."
        ]
    },
    "주사 피부": {
        "oily": [
            "**AI 진단:** 주사 피부염",
            "**피부 타입:** 지성",
            "**분석:** 피지 분비와 함께 혈관 확장이 동반되어 피부가 붉어지고 염증성 구진이 나타날 수 있습니다.",
            "**추천 솔루션:** 아젤라익애씨드 성분은 피지 조절과 염증 완화에 모두 도움이 될 수 있습니다. 가벼운 젤 타입의 수분 제품과 오일프리 선크림을 사용하세요.",
            "**생활 팁:** 맵고 뜨거운 음식, 음주, 사우나 등 혈관을 확장시키는 요인을 피하는 것이 매우 중요합니다."
        ],
        "dry": [
            "**AI 진단:** 주사 피부염",
            "**피부 타입:** 건성",
            "**분석:** 피부가 건조하고 장벽이 약해져 붉어짐과 따가움이 쉽게 발생하는 상태입니다.",
            "**추천 솔루션:** 나이아신아마이드, 세라마이드 등 장벽 강화 및 항염 효과가 있는 성분의 크림을 사용하세요. 순한 크림 클렌저를 사용하고, 자외선 차단은 무기자차(물리적 차단제)를 선택하는 것이 좋습니다.",
            "**생활 팁:** 급격한 온도 변화를 피하고, 히터나 난로 바람을 직접 쐬지 않도록 주의하세요. 스크럽이나 강한 클렌징 기기 사용은 금물입니다."
        ],
        "sensitive": [
            "**AI 진단:** 주사 피부염",
            "**피부 타입:** 민감성",
            "**분석:** 주사 피부염은 극도로 민감한 피부 상태로, 최소한의 자극에도 악화될 수 있습니다.",
            "**추천 솔루션:** 성분 목록이 가장 단순하고, 진정 효과(예: 감초추출물)가 입증된 제품을 사용하세요. 알코올, 향료, 멘톨, 유칼립투스 오일 등 자극 가능성이 있는 모든 성분을 피해야 합니다.",
            "**생활 팁:** 외출 시에는 항상 모자나 양산으로 자외선을 차단하고, 피부과 전문의와 상담하여 관리 계획을 세우는 것이 가장 안전합니다."
        ],
        "default": [
            "**AI 진단:** 주사 피부염",
            "**분석:** 얼굴 중앙 부위가 붉어지고 혈관이 확장되는 만성 염증성 질환일 수 있습니다.",
            "**추천 솔루션:** 알코올, 향료, 멘톨 등이 없는 매우 순한 제품을 사용하고, 자외선 차단은 필수입니다. 물리적 자외선 차단제를 사용하는 것을 권장합니다.",
            "**생활 팁:** 맵고 뜨거운 음식, 음주, 급격한 온도 변화 등 증상을 악화시키는 요인을 파악하고 피하는 것이 중요합니다."
        ]
    },
    "지루 피부": {
        "oily": [
            "**AI 진단:** 지루 피부염",
            "**피부 타입:** 지성",
            "**분석:** 과도한 피지 분비가 말라세지아 효모균의 증식을 유발하여 염증과 각질을 일으키는 상태입니다. 가장 흔한 케이스입니다.",
            "**추천 솔루션:** 케토코나졸, 시클로피록스 등 항진균 성분이 포함된 샴푸나 클렌저를 주 2-3회 사용하세요. 평소에는 BHA(살리실산) 클렌저로 피지를 조절하는 것이 도움이 됩니다.",
            "**생활 팁:** 기름진 음식, 인스턴트 식품, 스트레스를 피하고, 머리를 자주 감아 청결을 유지하는 것이 중요합니다."
        ],
        "dry": [
            "**AI 진단:** 지루 피부염",
            "**피부 타입:** 건성",
            "**분석:** 피부는 건조하지만, 피지선이 발달한 부위(두피, 코 옆 등)에 부분적으로 지루 피부염이 나타나는 복합적인 상태입니다.",
            "**추천 솔루션:** 항진균 성분 샴푸/클렌저 사용 횟수를 주 1-2회로 줄이고, 사용 후에는 반드시 충분한 보습을 해주어 건조함을 막아야 합니다. 자극이 없는 보습제를 사용하세요.",
            "**생활 팁:** 보습을 철저히 하여 피부 장벽을 건강하게 유지하는 것이 염증 완화에 도움이 됩니다. 강한 스크럽은 피하세요."
        ],
        "default": [
            "**AI 진단:** 지루 피부염",
            "**분석:** 피지 분비가 왕성한 부위에 발생하는 만성적인 습진성 피부염일 수 있습니다.",
            "**추천 솔루션:** 항진균 성분(케토코나졸 등)이 포함된 샴푸나 클렌저를 주기적으로 사용하여 관리하는 것이 효과적입니다.",
            "**생활 팁:** 기름진 음식, 단 음식, 음주를 피하고 충분한 수면을 통해 스트레스를 관리해야 합니다. 기름진 연고나 화장품은 피하는 것이 좋습니다."
        ]
    }
}

from rest_framework_simplejwt.views import TokenObtainPairView

# --- User and Auth Views ---
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# --- AI Model Views ---
class PredictionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not model or not labels:
            return Response({"error": "Model or labels not loaded properly."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        image_file = request.FILES.get('image')
        is_example = request.POST.get('is_example', 'false').lower() == 'true'
        
        if not image_file:
            return Response({"error": "No image provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            img = Image.open(image_file)
            img = img.resize((IMAGE_WIDTH, IMAGE_HEIGHT), Image.LANCZOS)
            img = img.convert('RGB')
            img_array = np.array(img)
            img_array = np.expand_dims(img_array, axis=0)

            prediction = model.predict(img_array)
            scores = prediction[0]

            confidences = {labels[i]: float(scores[i] * 100) for i in range(len(labels))}
            sorted_confidences = sorted(confidences.items(), key=lambda item: item[1], reverse=True)

            filtered_results = []
            for label, confidence in sorted_confidences:
                if confidence > 10.0:
                    filtered_results.append({'label': label, 'confidence': round(confidence, 2)})
                if len(filtered_results) >= 3:
                    break
            
            if not filtered_results:
                return Response({"prediction": "정확한 진단을 내리기 어렵습니다. 다른 이미지를 시도해 보세요."}, status=status.HTTP_200_OK)

            user_skin_type = 'default'
            if hasattr(request.user, 'profile') and request.user.profile.skin_type:
                user_skin_type = request.user.profile.skin_type

            combined_tips = []
            for result in filtered_results:
                disease_label = result['label']
                disease_tips_structure = SKINCARE_TIPS.get(disease_label, {})
                tips_for_disease = disease_tips_structure.get(user_skin_type, disease_tips_structure.get('default', []))
                
                if len(filtered_results) > 1 and tips_for_disease:
                    separator = f"--- {disease_label} ({result['confidence']:.1f}%) 관련 솔루션 ---"
                    combined_tips.append(separator)

                combined_tips.extend(tips_for_disease)
            
            response_data = {
                "predictions": filtered_results,
                "tips": combined_tips
            }

            if not is_example:
                Diagnosis.objects.create(
                    user=request.user,
                    image=image_file,
                    result=response_data
                )

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred during prediction: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ExampleImageView(APIView):
    def get(self, request, *args, **kwargs):
        examples_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'examples')
        image_files = []
        if os.path.exists(examples_dir):
            for f in os.listdir(examples_dir):
                if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    image_files.append(f)
        return Response({'example_images': image_files}, status=status.HTTP_200_OK)


# --- Review Views ---
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

class ReviewList(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class ReviewCreate(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

class DiagnosisHistoryView(generics.ListAPIView):
    serializer_class = DiagnosisSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Diagnosis.objects.filter(user=self.request.user)

class ProfileView(generics.RetrieveUpdateAPIView):
    """
    View to retrieve or update the user's profile.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializerForProfile
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DiagnosisDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = DiagnosisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Diagnosis.objects.filter(user=self.request.user)


# --- Admin Panel ViewSets ---
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

class UserAdminViewSet(viewsets.ModelViewSet):
    """
    Admin viewset for managing users.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminUser]

class ReviewAdminViewSet(viewsets.ModelViewSet):
    """
    Admin viewset for managing reviews.
    """
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewAdminSerializer
    permission_classes = [IsAdminUser]

class DiagnosisAdminViewSet(viewsets.ModelViewSet):
    """
    Admin viewset for managing diagnoses.
    """
    queryset = Diagnosis.objects.all().order_by('-created_at')
    serializer_class = DiagnosisAdminSerializer
    permission_classes = [IsAdminUser]