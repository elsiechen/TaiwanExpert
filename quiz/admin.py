from django.contrib import admin
from .models import User, Question, Answer, Report, RewardMenu, MyReward 

class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username")
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "content", "option1", "option2", "option3", "answer")
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "question", "content", "correct")
class ReportAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_time", "points")
class RewardMenuAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description","image","points")
class MyRewardAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "points", "created_time", "updated_time")

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(Report, ReportAdmin)
admin.site.register(RewardMenu, RewardMenuAdmin)
admin.site.register(MyReward, MyRewardAdmin)