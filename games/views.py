from django import forms
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError, models
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View
import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


from .models import User, Game

# Create your views here.

def index(request):
    return render(request, "games/index.html")

def space_invaders(request):
    return render(request, "games/space_invaders.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "games/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "games/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "games/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "games/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "games/register.html")

@method_decorator(csrf_exempt, name='dispatch')
class GameAPI(View):
    def post(self, request, username):

        data = json.loads(request.body.decode("utf-8"))
        user = User.objects.get(username=username)
        timestamp = data.get('timestamp')
        level = data.get('level')
        score = data.get('score')
        time = data.get('time')
        shots = data.get('shots')
        won = data.get('won')

        game_data = {
            'user': user,
            'timestamp': timestamp,
            'level': level,
            'score': score,
            'time': time,
            'shots': shots,
            'won': won,
        }

        game = Game.objects.create(**game_data)

        data = {
            "message": f"New game added to DB with id: {game.id}"
        }
        return JsonResponse(data, status=201)

@method_decorator(csrf_exempt, name='dispatch')
class GetUserGames(View):
    def get(self, request, id):
        
        games_count = Game.objects.all().filter(user=id).count()
        first_game_played = Game.objects.first()
        first_game_played_on = first_game_played.timestamp
        last_game_played = Game.objects.last() 
        last_game_played_on = last_game_played.timestamp
        games = Game.objects.all().filter(user=id)
        total_shots = 0
        for game in games:
             total_shots += game.shots
        average_shots_per_game = total_shots/games_count
        
        
        
        data = {
            'games_played':games_count,
            'first_game_played_on': first_game_played_on,
            'last_game_played_on': last_game_played_on,
            'total_shots': total_shots,
            'average_shots_per_game': average_shots_per_game
        }

        return JsonResponse(data, status=200)