from django.contrib import admin
from .models import Game, User

class GameAdmin(admin.ModelAdmin):
    list_display = ('id', 'timestamp')

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username')

admin.site.register(Game, GameAdmin)
admin.site.register(User, UserAdmin)