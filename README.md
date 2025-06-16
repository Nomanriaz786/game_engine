## API Endpoints

### 1. Store Game State
```http
POST /api/storeGameState
```

**Request Body:**
```json
{
    "created_at": "",
    "drawing_time": 0,
    "game_code": "1000",
    "games_Parts": ["Hat", "Head"],
    "join": true,
    "number_of_players": 1,
    "start_game": true,
    "players": [
        {
            "game_code": "",
            "player_body_images": [],
            "player_body_parts_with_player_names": ["Hat-", "Head-"],
            "player_current_step": [0, 1],
            "player_image": "",
            "player_name": "test",
            "player_number": 82
        }
    ]
}
```

**Flutter Example:**
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class GameService {
  final String baseUrl = 'http://your-api-url/api';

  Future<void> storeGameState(Map<String, dynamic> gameData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/storeGameState'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(gameData),
      );

      if (response.statusCode == 201) {
        print('Game state stored successfully');
      } else {
        throw Exception('Failed to store game state');
      }
    } catch (e) {
      print('Error: $e');
      rethrow;
    }
  }
}
```

### 2. Update Drawing Status
```http
POST /api/updateDrawingStatus
```

**Request Body:**
```json
{
    "created_at": "",
    "drawed_parts_of_player": "Hat",
    "drawing_points": [
        {
            "offsetDx": 157,
            "offsetDy": 120,
            "pointType": 0,
            "pressure": 1
        }
    ],
    "is_completed": false,
    "player_drawing": "",
    "player_id": 1,
    "player_image": "",
    "player_name": "",
    "player_part": "Hat"
}
```

**Flutter Example:**
```dart
Future<void> updateDrawingStatus(Map<String, dynamic> drawingData) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/updateDrawingStatus'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(drawingData),
    );

    if (response.statusCode == 201) {
      print('Drawing status updated successfully');
    } else {
      throw Exception('Failed to update drawing status');
    }
  } catch (e) {
    print('Error: $e');
    rethrow;
  }
}
```

### 3. Get Incomplete Users
```http
GET /api/incompleteUsers/:game_code/:part_name
```

**Flutter Example:**
```dart
Future<List<String>> getIncompleteUsers(String gameCode, String partName) async {
  try {
    final response = await http.get(
      Uri.parse('$baseUrl/incompleteUsers/$gameCode/$partName'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<String>.from(data['incompletePlayers']);
    } else {
      throw Exception('Failed to fetch incomplete users');
    }
  } catch (e) {
    print('Error: $e');
    rethrow;
  }
}
```

### 4. Get Drawing Data
```http
GET /api/getDrawing/:game_code/:player_name/:part_name
```

**Flutter Example:**
```dart
Future<Map<String, dynamic>> getDrawing(
  String gameCode,
  String playerName,
  String partName,
) async {
  try {
    final response = await http.get(
      Uri.parse('$baseUrl/getDrawing/$gameCode/$playerName/$partName'),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch drawing data');
    }
  } catch (e) {
    print('Error: $e');
    rethrow;
  }
}
```

### 5. Get Completed Drawings
```http
GET /api/completedDrawings/:game_code
```

**Response Body:**
```json
[
    {
        "created_at": "",
        "drawed_parts_of_player": "Hat",
        "drawing_points": [
            {
                "offsetDx": 157,
                "offsetDy": 120,
                "pointType": 0,
                "pressure": 1
            }
        ],
        "is_completed": true,
        "player_drawing": "",
        "player_id": 1,
        "player_image": "",
        "player_name": "",
        "player_part": "Hat"
    }
]
```

**Flutter Example:**
```dart
Future<List<Map<String, dynamic>>> getCompletedDrawings(String gameCode) async {
  try {
    final response = await http.get(
      Uri.parse('$baseUrl/completedDrawings/$gameCode'),
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to fetch completed drawings');
    }
  } catch (e) {
    print('Error: $e');
    rethrow;
  }
}
```

### 6. Update Game with Player
```http
PUT /api/updateGameWithPlayer
```

**Request Body:**
```json
{
    "game_code": "1000",
    "player_data": {
        "player_name": "test",
        "player_number": 82,
        "player_image": "",
        "player_body_parts_with_player_names": [
            "Hat-",
            "Head-"
        ],
        "player_current_step": [
            0,
            1
        ]
    }
}
```

**Response Body:**
```json
{
    "message": "Game updated successfully",
    "game": {
        "created_at": "",
        "drawing_time": 0,
        "game_code": "1000",
        "games_Parts": [
            "Hat",
            "Head"
        ],
        "join": true,
        "number_of_players": 1,
        "start_game": true,
        "players": [
            {
                "game_code": "1000",
                "player_body_images": [],
                "player_body_parts_with_player_names": [
                    "Hat-",
                    "Head-"
                ],
                "player_current_step": [
                    0,
                    1
                ],
                "player_image": "",
                "player_name": "test",
                "player_number": 82
            }
        ]
    }
}
```

**Flutter Example:**
```dart
Future<Map<String, dynamic>> updateGameWithPlayer(String gameCode, Map<String, dynamic> playerData) async {
  try {
    final response = await http.put(
      Uri.parse('$baseUrl/updateGameWithPlayer'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'game_code': gameCode,
        'player_data': playerData
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to update game with player');
    }
  } catch (e) {
    print('Error: $e');
    rethrow;
  }
}
```

### 7. Update Game Status (Admin)
```http
PUT /api/updateGameStatus
```

**Request Body:**
```json
{
    "game_code": "1000",
    "start_game": true,
    "join": false,
    "drawing_time": 60
}
```

**Response Body:**
```json
{
    "message": "Game status updated successfully",
    "game": {
        "created_at": "",
        "drawing_time": 60,
        "game_code": "1000",
        "games_Parts": [
            "Hat",
            "Head"
        ],
        "join": false,
        "number_of_players": 1,
        "start_game": true,
        "players": [
            {
                "game_code": "1000",
                "player_body_images": [],
                "player_body_parts_with_player_names": [
                    "Hat-",
                    "Head-"
                ],
                "player_current_step": [
                    0,
                    1
                ],
                "player_image": "",
                "player_name": "test",
                "player_number": 82
            }
        ]
    }
}
```

**Flutter Example:**
```dart
Future<Map<String, dynamic>> updateGameStatus({
  required String gameCode,
  bool? startGame,
  bool? join,
  int? drawingTime,
}) async {
  try {
    final response = await http.put(
      Uri.parse('$baseUrl/updateGameStatus'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'game_code': gameCode,
        if (startGame != null) 'start_game': startGame,
        if (join != null) 'join': join,
        if (drawingTime != null) 'drawing_time': drawingTime,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to update game status');
    }
  } catch (e) {
    print('Error: $e');
    rethrow;
  }
}
```

### 8. Validate and Join Game
```http
POST /api/validateJoinGame
```

**Request Body:**
```json
{
    "game_code": "1000",
    "player_data": {
        "player_name": "test",
        "player_number": 82,
        "player_image": "",
        "player_body_parts_with_player_names": [
            "Hat-",
            "Head-"
        ],
        "player_current_step": [
            0,
            1
        ]
    }
}
```

**Response Body (Success - Joined Game):**
```json
{
    "message": "User joined the game successfully",
    "canJoin": true,
    "game": {
        "game_code": "1000",
        "number_of_players": 1,
        "games_Parts": [
            "Hat",
            "Head"
        ],
        "players": [
            {
                "game_code": "1000",
                "player_name": "test",
                "player_number": 82,
                "player_image": "",
                "player_body_parts_with_player_names": [
                    "Hat-",
                    "Head-"
                ],
                "player_current_step": [
                    0,
                    1
                ],
                "player_body_images": []
            }
        ]
    }
}
```

**Response Body (Error - Game Started):**
```json
{
    "message": "Room already started",
    "canJoin": false
}
```

**Response Body (Error - Room Closed):**
```json
{
    "message": "Room is not accepting new players",
    "canJoin": false
}
```

**Flutter Example:**
```dart
Future<Map<String, dynamic>> validateAndJoinGame({
  required String gameCode,
  required Map<String, dynamic> playerData,
}) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/validateJoinGame'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'game_code': gameCode,
        'player_data': playerData
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['message']);
    }
  } catch (e) {
    print('Error: $e');
    rethrow;
  }
}

// Usage example:
try {
  final result = await validateAndJoinGame(
    gameCode: '1000',
    playerData: {
      'player_name': 'test',
      'player_number': 82,
      'player_image': '',
      'player_body_parts_with_player_names': ['Hat-', 'Head-'],
      'player_current_step': [0, 1]
    }
  );
  if (result['canJoin']) {
    // Player has been added to the game
    print('Joined game: ${result['game']}');
  }
} catch (e) {
  // Handle error (game started or room closed)
  print('Cannot join: $e');
}
```

