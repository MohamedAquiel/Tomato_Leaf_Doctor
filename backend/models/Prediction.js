const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    diseaseKey: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    isHealthy: {
      type: Boolean,
      default: false,
    },
    solution: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    topPredictions: [
      {
        diseaseKey: String,
        displayName: String,
        confidence: Number,
      },
    ],
    isGuest: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);
PredictionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Prediction", PredictionSchema);
