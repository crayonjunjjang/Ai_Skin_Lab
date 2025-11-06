from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Diagnosis, Review, Profile

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['is_staff'] = user.is_staff

        return token

class RegisterSerializer(serializers.ModelSerializer):
    age = serializers.IntegerField(write_only=True)
    gender = serializers.CharField(write_only=True)
    skin_type = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'age', 'gender', 'skin_type')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("이미 사용중인 아이디입니다.")
        return value

    def create(self, validated_data):
        age = validated_data.pop('age')
        gender = validated_data.pop('gender')
        skin_type = validated_data.pop('skin_type')

        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        
        Profile.objects.create(
            user=user,
            age=age,
            gender=gender,
            skin_type=skin_type
        )

        return user

# A simple serializer for displaying user information (read-only)
class UserDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class ReviewSerializer(serializers.ModelSerializer):
    # Use the display serializer for nested representation (read-only)
    user = UserDisplaySerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'text', 'created_at']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        # Associate the user from the request context
        user = self.context['request'].user
        review = Review.objects.create(user=user, **validated_data)
        return review

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = ['id', 'image', 'result', 'created_at']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('age', 'gender', 'skin_type')

class UserSerializerForProfile(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'profile')

    def get_profile(self, obj):
        profile, created = Profile.objects.get_or_create(user=obj)
        return ProfileSerializer(profile).data

    def update(self, instance, validated_data):
        # This part of the update logic is now handled by the ProfileView's serializer
        # We can simplify or adjust if needed, but for now, let's focus on retrieval.
        # The existing update logic in ProfileView should handle nested updates.
        profile_data = self.context['request'].data.get('profile', {})
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.save()

        profile.age = profile_data.get('age', profile.age)
        profile.gender = profile_data.get('gender', profile.gender)
        profile.skin_type = profile_data.get('skin_type', profile.skin_type)
        profile.save()

        return instance

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


# --- Admin Panel Serializers ---

class UserAdminSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_active', 'date_joined', 'profile']

class ReviewAdminSerializer(serializers.ModelSerializer):
    user = UserDisplaySerializer(read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'text', 'created_at']

class DiagnosisAdminSerializer(serializers.ModelSerializer):
    user = UserDisplaySerializer(read_only=True)
    class Meta:
        model = Diagnosis
        fields = ['id', 'user', 'image', 'result', 'created_at']