import catchAsyncError from '../middlewares/catchAsyncError.js';
import Folder from '../models/folder.js';
import File from '../models/file.js';

export const createFolder = catchAsyncError(async (req, res) => {

  const { name, parentFolderId } = req.body;
  const ownerId = req.user._id;
  const folder = new Folder({ name, parentFolder: parentFolderId, owner: ownerId });
  await folder.save();

  res.status(201).json({ message: 'Folder created', folder });

});

export const getFolderById = catchAsyncError(async (req, res) => {
  let { folderId } = req.query;
  if(!folderId) folderId = req.user.rootFolder;

  const folder = await Folder.find({parentFolder: folderId});
  const files = await File.find({parentFolder: folderId});
  res.status(200).json([...folder, ...files]);
});

export const deleteFolder = catchAsyncError(async (req, res) => {
  const { folderId } = req.body;
  const folder = await Folder.findById(folderId);
  if (!folder) return res.status(404).json({ message: 'Folder not found' });
  await folder.deleteOne();
  res.status(200).json({ message: 'Folder deleted' });
});

export const changeFolderName = catchAsyncError(async (req, res) => {
  const { folderId, newName } = req.body;
  const folder = await Folder.findById(folderId);
  if (!folder) return res.status(404).json({ message: 'Folder not found' });
  folder.name = newName;
  await folder.save();
  res.status(200).json({ message: 'Folder name changed' });
});