from django.urls import path
from.views import GetHighScores, PostGame, GetUserGameStats

from . import views

urlpatterns = [
    # path("", views.index, name="index"),
    path("", views.space_invaders, name="space-invaders"),
    path("index", views.space_invaders, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("space_invaders", views.space_invaders, name="space_invaders"),

    path("api/user/<str:username>/game", PostGame.as_view()),
    path("api/user/<int:id>/gamestats", GetUserGameStats.as_view()),
    path("api/highscores", GetHighScores.as_view()),
    ]