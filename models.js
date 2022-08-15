const mongoose = require('mongoose');

let composerSchema = mongoose.Schema({
  givenname: { type: String, required: true },
  surname: { type: String, required: true },
  DOB: { type: Date }
})

let pieceSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  instruments: { type: String },
  composer: { type: mongoose.Schema.Types.ObjectId, ref: "Composer", required: true }
});

let recordingSchema = mongoose.Schema({
  piece: { type: mongoose.Schema.Types.ObjectId, ref: "Piece", required: true },
  composer: { type: mongoose.Schema.Types.ObjectId, ref: "Composer", required: true },
  performers: { type: Array, required: true }
})

let discSchema = mongoose.Schema({
  recordings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recording", required: true }],
  recordlabel: { type: String, required: true },
  catalognumber: { type: String, required: true }
})

let Composer = mongoose.model('Composer', composerSchema)
let Piece = mongoose.model('Piece', pieceSchema);
let Recording = mongoose.model('Recording', recordingSchema);
let Disc = mongoose.model('Disc', discSchema);

module.exports.Composer = Composer;
module.exports.Piece = Piece;
module.exports.Recording = Recording;
module.exports.Disc = Disc;