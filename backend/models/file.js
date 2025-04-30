import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentFolder: { type: String, required: true },
  url: {type: String, required: true },
  public_id: {type: String, required: false},
  mimeType: { type: String, required: false },
  size: { type: Number, required: true },
  transcription: { type: String,default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  type: { type: String, default: 'file' },
});

const File = mongoose.model('File', fileSchema);
export default File;