const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  titleSlug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  solvedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
});

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
