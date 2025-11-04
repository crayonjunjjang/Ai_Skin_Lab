from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MyTokenObtainPairView, RegisterView, PredictionView, ExampleImageView,
    ReviewList, ReviewCreate, DiagnosisHistoryView, DiagnosisDetailView,
    ProfileView, ChangePasswordView,
    UserAdminViewSet, ReviewAdminViewSet, DiagnosisAdminViewSet
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    # Auth
    path('users/register/', RegisterView.as_view(), name='register'),
    path('users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # Main Features
    path('predict/', PredictionView.as_view(), name='predict'),
    path('examples/', ExampleImageView.as_view(), name='example_images'),

    # Reviews
    path('reviews/', ReviewList.as_view(), name='review-list'),
    path('reviews/create/', ReviewCreate.as_view(), name='review-create'),

    # History
    path('history/', DiagnosisHistoryView.as_view(), name='diagnosis-history'),
    path('history/<int:pk>/', DiagnosisDetailView.as_view(), name='diagnosis-detail'),
]

# --- Admin Router ---
router = DefaultRouter()
router.register(r'users', UserAdminViewSet, basename='admin-users')
router.register(r'reviews', ReviewAdminViewSet, basename='admin-reviews')
router.register(r'diagnoses', DiagnosisAdminViewSet, basename='admin-diagnoses')

urlpatterns += [
    path('admin/', include(router.urls)),
]
