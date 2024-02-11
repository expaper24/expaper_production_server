const mongoose = require("mongoose");

const qPaperSchema = new mongoose.Schema({
    university: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    sem: {
        type: Number,
        required: true,
    },
    paperLink: {
        type: String,
        required: true,
        unique: true,
    }
});

const paperModel = mongoose.model("QPaper", qPaperSchema);
module.exports = paperModel;