def calculate_elaborate_scores(games):
        elaborate_scores = []
        for game in games:
            elaborate_score = game.elaborate_score
            elaborate_scores.append(round(elaborate_score*100))
        return elaborate_scores

def get_best_time(games):
    game_times = []
    for game in games:
        time = game.time
        game_times.append(time)
    return min(game_times)

def get_average_game_time(games, games_count):
    total_time = 0
    for game in games:
        total_time += game.time
    return round(total_time/games_count, 2)

def calculate_total_shots(games):
    total_shots = 0
    for game in games:
            total_shots += game.shots
    return  total_shots

def create_highscore_object(level_games):
    data = {}
    for game in level_games:
        value = {
            "username": game.user.username,
            "elaborate_score": game.elaborate_score,
            "timestamp": game.timestamp
        }
        data[game.id] = value
    return data