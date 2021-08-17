const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    image: {
        type: String
    },
    createdAt: {
        type: String,
        default: Date.now
    },
    submittedAt: {
        type: String
    },
    score: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    answers: {
        type: Array
    }
});

module.exports = mongoose.model("User", UserSchema);