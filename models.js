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
  recordings: [Object],
  composer: { type: mongoose.Schema.Types.ObjectId, ref: "Composer", required: true },
});

let Composer = mongoose.model('Composer', composerSchema)
let Piece = mongoose.model('Piece', pieceSchema);

module.exports.Composer = Composer;
module.exports.Piece = Piece;

