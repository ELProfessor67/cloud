import catchAsyncError from '../middlewares/catchAsyncError.js';
import File from '../models/file.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import "dotenv/config";
import { transcribeAudio, transcribeAudioFromURL } from '../utils/transcribeAudio.js';
import Folder from '../models/folder.js';
import {uploadBase64ToDG, uploadFileByFile} from '../services/digitalOceanService.js';
import path from 'path';
const __dirname = path.resolve();
import UserModel from "../models/user.js"
import { url } from 'inspector';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = catchAsyncError(async (req, res) => {

  const { folderId, createdAt } = req.body;
  const file = req.file;
  const ownerId = req.user.id;
  if (!folderId) folderId = req.user.rootFolder;
  if (!file) return res.status(401).json({ message: 'File is requied' });

  // const result = await cloudinary.uploader.upload(file.path, { resource_type: 'auto' });
  const filePath = req.file?.path

  // const result = await uploadBase64ToDG(file.buffer.toString('base64'), file.originalname.replaceAll(" ",'-'), file.mimetype)
  const result = await uploadFileByFile(path.resolve(__dirname,filePath), file.originalname.replaceAll(" ",'-'))

  let transcription = null;
  if (file.mimetype.startsWith('audio')) {
    transcription = await transcribeAudio(file.path);
  }


  const newFile = new File({
    name: file.originalname,
    folder: folderId,
    parentFolder: folderId,
    owner: ownerId,
    url: result,
    public_id: result,
    mimeType: file.mimetype,
    size: file.size,
    transcription,
    createdAt: createdAt,
  });

  await newFile.save();
  res.status(201).json({ message: 'File uploaded', file: newFile });

});

export const save_cube_acr_file = catchAsyncError(async (req, res) => {

  const { createdAt,transcription,file_url,mimeType, fileSize,label,file_name } = req.body;
  const user = await UserModel.findOne();
  const ownerId = user.id;
  const rootFolder = user.rootFolder;

  let folder = await Folder.findOne({name: label});
  if(!folder){
    folder = await Folder.create({name: label, parentFolder: rootFolder, owner: ownerId})
  }

  const newFile = new File({
    name: file_name,
    folder: folder._id,
    parentFolder: folder._id,
    owner: ownerId,
    url: file_url,
    public_id: "none",
    mimeType: mimeType,
    size: fileSize,
    transcription,
    createdAt: createdAt,
  });

  await newFile.save();
  res.status(201).json({ message: 'File uploaded', file: newFile });
});

export const deleteFile = catchAsyncError(async (req, res) => {
  const { fileId } = req.body;
  const file = await File.findById(fileId);
  if (!file) return res.status(404).json({ message: 'File not found' });
  // await cloudinary.uploader.destroy(file.filePath);
  await file.deleteOne();
  res.status(200).json({ message: 'File deleted' });
});


export const changeFileName = catchAsyncError(async (req, res) => {
  const { fileId, newName } = req.body;
  const file = await File.findById(fileId);
  if (!file) return res.status(404).json({ message: 'File not found' });
  file.name = newName;
  await file.save();
  res.status(200).json({ message: 'File name updated' });
});



export const uploadFileStructure = catchAsyncError(async (req, res) => {
  console.log(req.body)
  const { folderData, folderId } = req.body; 

  // Handle each file/folder data
  const processFolderData = async (data, parentFolderId = null) => {
    if (data.type === 'folder') {



      console.log('create folder')
      const newFolder = new Folder({
        name: data.name,
        parentFolder: parentFolderId,
        owner: req.user.id,
      });
      await newFolder.save();
      console.log('folder creatde successfully')


      // Recursively process subfolders
      for (const child of data.child) {
        await processFolderData(child, newFolder._id);
      }

    } else if (data.type === 'file') {
      // Upload file to Cloudinary
      console.log('file upload....')
      // const result = await cloudinary.uploader.upload(data.file.data, {
      //   resource_type: 'auto',
      // });
      const result = await uploadBase64ToDG(data.file.data, data.file.name.replaceAll(" ",'-'), data.file.mimeType)


      let transcription = null;
      if (data.file.mimeType.startsWith('audio')) {
        transcription = await transcribeAudioFromURL(data.file.data?.split('base64,')[1]);
      }

      console.log('file upload successfully')

      const newFile = new File({
        name: data.file.name,
        folder: parentFolderId,
        parentFolder: parentFolderId,
        owner: req.user.id,
        url: result,
        public_id: result,
        mimeType: data.file.mimeType,
        size: data.file.size,
        createdAt: data.createdAt,
        updatedAt: data.createdAt,
        transcription,
      });

      await newFile.save();
      console.log('new file save')
    }
  };

  // Start processing the folder structure
  for (const folder of folderData) {
    await processFolderData(folder,folderId);
  }

  res.status(201).json({ message: 'Folder structure uploaded successfully' });
});