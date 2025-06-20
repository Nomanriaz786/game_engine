const mongoose = require('mongoose');

const drawingPointSchema = new mongoose.Schema({
    offsetDx: Number,
    offsetDy: Number,
    pointType: Number,
    pressure: Number
});

const drawingSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    drawed_parts_of_player: String,
    drawing_points: [drawingPointSchema],
    is_completed: {
        type: Boolean,
        default: false
    },
    player_drawing: String,
    player_id: Number,
    player_image: String,
    player_name: String,
    player_part: String
});

module.exports = mongoose.model('Drawing', drawingSchema); 