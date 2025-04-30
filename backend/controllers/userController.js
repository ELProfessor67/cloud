import UserModel from '../models/user.js';
import FolderModel from '../models/folder.js';
import catchAsyncError from '../middlewares/catchAsyncError.js';
import { sendToken } from '../utils/sendToken.js';
import { sendResponse } from '../utils/sendResponse.js';

// Create a new user
export const createUser = catchAsyncError(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return sendResponse(false, 400, 'All fields are required', res);

  const user = new UserModel({ name, email,password: password });
  await user.save();

  const rootFolder = new FolderModel({ name: 'Root', owner: user._id });
  await rootFolder.save();

  user.rootFolder = rootFolder._id;
  await user.save();
  sendToken(res, user, "Registered Successfully", 201);
});



export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return sendResponse(false, 401, 'All fields are required', res);
  let user = await UserModel.findOne({ email }).select('+password');
  if (!user)
    return sendResponse(false, 401, 'Incorrect Email or Password', res);

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return sendResponse(false, 401, 'Incorrect Email or Password', res);

  sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

export const loadme = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user
  })
});

export const logout = catchAsyncError(async (req, res, next) => {
  res.clearCookie('token').status(200).json({
    success: true,
    message: 'Logout successfully'
  })
});


export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  const user = await UserModel.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(oldpassword);
  if (!isMatch)
    return sendResponse(false, 401, 'Incorrect old password', res);

  user.password = newpassword;
  await user.save();

  sendResponse(true, 200, 'Password update successfully', res);
});