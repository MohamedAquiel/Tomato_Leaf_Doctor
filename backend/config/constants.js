module.exports = {
  ROLES: {
    ADMIN: "admin",
    USER: "user",
  },
  DISEASE_CLASSES: [
    "Tomato___Bacterial_Spot",
    "Tomato___Early_Blight",
    "Tomato___Late_Blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_Leaf_Spot",
    "Tomato___Spider_Mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___Healthy",
  ],
  NOTIFICATION_TYPES: {
    PREDICTION: "prediction",
    SYSTEM: "system",
    TIP: "tip",
    ALERT: "alert",
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  UPLOAD: {
    ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    MAX_SIZE: 5 * 1024 * 1024,
  },
};
