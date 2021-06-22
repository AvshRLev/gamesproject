from django.urls import path

from . import views

urlpatterns = [
    # path("", views.index, name="index"),
    path("", views.space_invaders, name="space-invaders"),
    path("index", views.space_invaders, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("space_invaders", views.space_invaders, name="space_invaders")
    ]