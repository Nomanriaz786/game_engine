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

## Complete Flutter Service Example

Here's a complete service class you can use in your Flutter app:

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class GameService {
  final String baseUrl = 'http://your-api-url/api';

  // Store game state
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

  // Update drawing status
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

  // Get incomplete users
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

  // Get drawing data
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
}
```

## Usage in Flutter

1. Add the http package to your `pubspec.yaml`:
```yaml
dependencies:
  http: ^1.1.0
```

2. Create an instance of the service:
```dart
final gameService = GameService();
```

3. Use the service in your widgets:
```dart
// Store game state
await gameService.storeGameState(gameData);

// Update drawing
await gameService.updateDrawingStatus(drawingData);

// Get incomplete users
final incompleteUsers = await gameService.getIncompleteUsers('1000', 'Hat');

// Get drawing data
final drawingData = await gameService.getDrawing('1000', 'player1', 'Hat');
```

## Error Handling

All API endpoints include proper error handling. Make sure to handle errors appropriately in your Flutter app:

```dart
try {
  await gameService.storeGameState(gameData);
} catch (e) {
  // Show error message to user
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('Error: $e')),
  );
} 