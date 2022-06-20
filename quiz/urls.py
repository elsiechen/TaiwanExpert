from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("quiz_view", views.quiz_view, name="quiz_view"),
    path("get_questions", views.get_questions, name="get_questions"),
    path("save_questions", views.save_questions, name="save_questions"),
    path("history_view", views.history_view, name="history_view"),
    path("get_details/<int:report_id>", views.get_details, name="get_details"),
    path("reward_view", views.reward_view, name="reward_view"),
    path("add_reward/<int:reward_id>", views.add_reward, name="add_reward"),
    path("login_view", views.login_view, name="login_view"),
    path("logout_view", views.logout_view, name="logout_view"),
    path("register", views.register, name="register"),
   
]