const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Drawing = require('../models/Drawing');

/**
 * @swagger
 * components:
 *   schemas:
 *     GameState:
 *       type: object
 *       required:
 *         - game_code
 *         - games_Parts
 *         - players
 *       properties:
 *         created_at:
 *           type: string
 *         drawing_time:
 *           type: number
 *         game_code:
 *           type: string
 *         games_Parts:
 *           type: array
 *           items:
 *             type: string
 *         join:
 *           type: boolean
 *         number_of_players:
 *           type: number
 *         start_game:
 *           type: boolean
 *         players:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               game_code:
 *                 type: string
 *               player_body_images:
 *                 type: array
 *               player_body_parts_with_player_names:
 *                 type: array
 *               player_current_step:
 *                 type: array
 *               player_image:
 *                 type: string
 *               player_name:
 *                 type: string
 *               player_number:
 *                 type: number
 *     DrawingStatus:
 *       type: object
 *       required:
 *         - player_part
 *         - drawing_points
 *       properties:
 *         created_at:
 *           type: string
 *         drawed_parts_of_player:
 *           type: string
 *         drawing_points:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               offsetDx:
 *                 type: number
 *               offsetDy:
 *                 type: number
 *               pointType:
 *                 type: number
 *               pressure:
 *                 type: number
 *         is_completed:
 *           type: boolean
 *         player_drawing:
 *           type: string
 *         player_id:
 *           type: number
 *         player_image:
 *           type: string
 *         player_name:
 *           type: string
 *         player_part:
 *           type: string
 */

/**
 * @swagger
 * /api/storeGameState:
 *   post:
 *     summary: Store the game state
 *     tags: [Game]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameState'
 *     responses:
 *       201:
 *         description: Game state stored successfully
 *       400:
 *         description: Invalid input
 */
router.post('/storeGameState', async (req, res) => {
    try {
        const gameData = req.body;
        const game = new Game(gameData);
        await game.save();
        res.status(201).json({ message: 'Game state stored successfully', game });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/updateDrawingStatus:
 *   post:
 *     summary: Update drawing status
 *     tags: [Game]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DrawingStatus'
 *     responses:
 *       201:
 *         description: Drawing status updated successfully
 *       400:
 *         description: Invalid input
 */
router.post('/updateDrawingStatus', async (req, res) => {
    try {
        const drawingData = req.body;
        const drawing = new Drawing(drawingData);
        await drawing.save();
        res.status(201).json({ message: 'Drawing status updated successfully', drawing });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/incompleteUsers/{game_code}/{part_name}:
 *   get:
 *     summary: Get incomplete users for a game and part
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: game_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Game code
 *       - in: path
 *         name: part_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Part name
 *     responses:
 *       200:
 *         description: List of incomplete players
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 incompletePlayers:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Game or part not found
 */
router.get('/incompleteUsers/:game_code/:part_name', async (req, res) => {
    try {
        const { game_code, part_name } = req.params;

        // Fetch the game to get all players
        const game = await Game.findOne({ game_code });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Get all player names
        const allPlayerNames = game.players.map(player => player.player_name);

        // Find all drawings for this game and part that are completed
        const completedDrawings = await Drawing.find({
            game_code,
            player_part: part_name,
            is_completed: true
        }, { player_name: 1 });

        // Player names who completed the drawing
        const completedPlayerNames = completedDrawings.map(d => d.player_name);

        // Filter players who have NOT completed the drawing
        const incompletePlayers = allPlayerNames.filter(
            name => !completedPlayerNames.includes(name)
        );

        res.json({ incompletePlayers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/getDrawing/{game_code}/{player_name}/{part_name}:
 *   get:
 *     summary: Get drawing data for a player and part
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: game_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Game code
 *       - in: path
 *         name: player_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Player name
 *       - in: path
 *         name: part_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Part name
 *     responses:
 *       200:
 *         description: Drawing data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 drawing_points:
 *                   type: array
 *                   items:
 *                     type: object
 *                 is_completed:
 *                   type: boolean
 *       404:
 *         description: Drawing not found
 */
router.get('/getDrawing/:game_code/:player_name/:part_name', async (req, res) => {
    try {
        const { game_code, player_name, part_name } = req.params;
        const drawing = await Drawing.findOne({
            game_code,
            player_name,
            player_part: part_name
        });

        if (!drawing) {
            return res.status(404).json({ message: 'Drawing not found' });
        }

        res.json({
            drawing_points: drawing.drawing_points,
            is_completed: drawing.is_completed
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/completedDrawings/{game_code}:
 *   get:
 *     summary: Get all completed drawings for a game
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: game_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Game code
 *     responses:
 *       200:
 *         description: List of completed drawings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DrawingStatus'
 *       404:
 *         description: No completed drawings found
 */
router.get('/completedDrawings/:game_code', async (req, res) => {
    try {
        const { game_code } = req.params;
        
        // Find all completed drawings for the game
        const completedDrawings = await Drawing.find({
            is_completed: true
        });

        if (!completedDrawings || completedDrawings.length === 0) {
            return res.status(404).json({ message: 'No completed drawings found' });
        }

        res.json(completedDrawings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/updateGameWithPlayer:
 *   put:
 *     summary: Update game with new player data
 *     tags: [Game]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - game_code
 *               - player_data
 *             properties:
 *               game_code:
 *                 type: string
 *               player_data:
 *                 type: object
 *                 properties:
 *                   player_name:
 *                     type: string
 *                   player_number:
 *                     type: number
 *                   player_image:
 *                     type: string
 *                   player_body_parts_with_player_names:
 *                     type: array
 *                     items:
 *                       type: string
 *                   player_current_step:
 *                     type: array
 *                     items:
 *                       type: number
 *     responses:
 *       200:
 *         description: Game updated successfully
 *       404:
 *         description: Game not found
 */
router.put('/updateGameWithPlayer', async (req, res) => {
    try {
        const { game_code, player_data } = req.body;

        // Find the game by game_code
        const game = await Game.findOne({ game_code });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Add game_code to player data
        const updatedPlayerData = {
            ...player_data,
            game_code: game_code,
            player_body_images: player_data.player_body_images || []
        };

        // Add new player to players array
        game.players.push(updatedPlayerData);

        // Update number_of_players based on players array length
        game.number_of_players = game.players.length;

        // Save the updated game
        await game.save();

        res.status(200).json({
            message: 'Game updated successfully',
            game: game
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/updateGameStatus:
 *   put:
 *     summary: Update game status fields (admin only)
 *     tags: [Game]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - game_code
 *             properties:
 *               game_code:
 *                 type: string
 *               start_game:
 *                 type: boolean
 *               join:
 *                 type: boolean
 *               drawing_time:
 *                 type: number
 *     responses:
 *       200:
 *         description: Game status updated successfully
 *       404:
 *         description: Game not found
 */
router.put('/updateGameStatus', async (req, res) => {
    try {
        const { game_code, start_game, join, drawing_time } = req.body;

        // Find the game by game_code
        const game = await Game.findOne({ game_code });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Update only the fields that are provided
        if (start_game !== undefined) {
            game.start_game = start_game;
        }
        if (join !== undefined) {
            game.join = join;
        }
        if (drawing_time !== undefined) {
            game.drawing_time = drawing_time;
        }

        // Save the updated game
        await game.save();

        res.status(200).json({
            message: 'Game status updated successfully',
            game: game
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/validateJoinGame:
 *   post:
 *     summary: Validate if user can join the game and add them if possible
 *     tags: [Game]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - game_code
 *               - player_data
 *             properties:
 *               game_code:
 *                 type: string
 *               player_data:
 *                 type: object
 *                 properties:
 *                   player_name:
 *                     type: string
 *                   player_number:
 *                     type: number
 *                   player_image:
 *                     type: string
 *                   player_body_parts_with_player_names:
 *                     type: array
 *                     items:
 *                       type: string
 *                   player_current_step:
 *                     type: array
 *                     items:
 *                       type: number
 *     responses:
 *       200:
 *         description: User joined the game successfully
 *       400:
 *         description: Game has already started or room is closed
 *       404:
 *         description: Game not found
 */
router.post('/validateJoinGame', async (req, res) => {
    try {
        const { game_code, player_data } = req.body;

        // Find the game by game_code
        const game = await Game.findOne({ game_code });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Check if game has already started
        if (game.start_game) {
            return res.status(400).json({ 
                message: 'Room already started',
                canJoin: false
            });
        }

        // Check if game is open for joining
        if (!game.join) {
            return res.status(400).json({ 
                message: 'Room is not accepting new players',
                canJoin: false
            });
        }

        // Add game_code to player data
        const updatedPlayerData = {
            ...player_data,
            game_code: game_code,
            player_body_images: player_data.player_body_images || []
        };

        // Add new player to players array
        game.players.push(updatedPlayerData);

        // Update number_of_players based on players array length
        game.number_of_players = game.players.length;

        // Save the updated game
        await game.save();

        res.status(200).json({
            message: 'User joined the game successfully',
            canJoin: true,
            game: {
                game_code: game.game_code,
                number_of_players: game.number_of_players,
                games_Parts: game.games_Parts,
                players: game.players
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/getGameData/{game_code}:
 *   get:
 *     summary: Get game data by game code
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: game_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Game code
 *     responses:
 *       200:
 *         description: Game data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameState'
 *       404:
 *         description: Game not found
 */
router.get('/getGameData/:game_code', async (req, res) => {
    try {
        const { game_code } = req.params;

        // Find the game by game_code
        const game = await Game.findOne({ game_code });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.status(200).json({
            message: 'Game data retrieved successfully',
            game: game
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 