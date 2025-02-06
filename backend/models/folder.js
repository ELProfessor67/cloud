import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  type: { type: String, default: 'folder' },
});

const Folder = mongoose.model('Folder', folderSchema);
export default Folder;
