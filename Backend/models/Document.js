const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  _id: String,       // document ID
  content: Object,   // Quill stores content as JSON
});

module.exports = mongoose.model("Document", DocumentSchema);
