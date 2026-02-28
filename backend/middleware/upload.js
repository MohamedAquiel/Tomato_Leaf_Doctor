const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { UPLOAD } = require("../config/constants");
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    const dest = process.env.UPLOAD_PATH || "uploads/";
    cb(null, dest);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `Unsupported file type '${file.mimetype}'. Allowed types: ${UPLOAD.ALLOWED_TYPES.join(", ")}.`
      ),
      false
    );
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || UPLOAD.MAX_SIZE,
  },
});
const uploadSingle = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) {
      return upload.single("image")(req, res, next);
    }
    next();
  });
};

module.exports = { upload, uploadSingle };
