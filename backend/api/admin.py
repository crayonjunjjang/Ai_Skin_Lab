from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Review, Diagnosis, Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)

class DiagnosisAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('user__username',)
    readonly_fields = ('user', 'image', 'result', 'created_at')

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

admin.site.register(Review)
admin.site.register(Diagnosis, DiagnosisAdmin)