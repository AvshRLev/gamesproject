from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    pass

class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player")
    timestamp = models.DateTimeField(auto_now_add=True)
    level = models.IntegerField()
    score = models.IntegerField()
    time = models.IntegerField()
    shots = models.IntegerField()
    won = models.BooleanField()