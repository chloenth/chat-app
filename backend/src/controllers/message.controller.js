import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

// get Users except the loggedIn User
export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error in getUsers controller: ', error.message);
    res.status(500).json({ message: `Internal Error: ${error.message}` });
  }
};

// get Messages of loggedIn User and the target User
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getMessages controller: ', error.message);
    res.status(500).json({ message: `Internal Error: ${error.message}` });
  }
};

// send Message
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      console.log('image available');
      const uploadResponse = await cloudinary.uploader.upload(image.path, {
        folder: 'chatApp-imageMessages',
      });
      imageUrl = uploadResponse.secure_url;

      console.log('imageUrl upload successfully: ', imageUrl);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo: realtime functionality goes here => socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);

    // if receiver is online, broadcast a event to receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in sendMessage controller: ', error.message);
    res.status(500).json({ message: `Internal Error: ${error.message}` });
  }
};
