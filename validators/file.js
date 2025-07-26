const allowedMimetypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "audio/mpeg",       // .mp3
  "audio/wav",        // .wav
  "audio/mp4",        // .m4a / .mp4 audio
  "video/mp4",        // .mp4
  "video/mpeg",       // .mpeg
  "video/x-matroska", // .mkv
];

const validateExtension = (file) => {
  return allowedMimetypes.includes(file.mimetype);
};

module.exports = validateExtension;
