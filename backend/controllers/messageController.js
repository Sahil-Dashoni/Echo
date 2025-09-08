import e from "express";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import uploadOnCloudinary  from "../config/cloudinary.js";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../socket/socket.js";

export  const sendMessage = async (req, res) => {
    try {
        let sender = req.userId;;
        let {receiver} = req.params;
        let {message} = req.body;
        let image = req.file ? await uploadOnCloudinary(req.file.path) : '';

        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        });

        let newMessage = await Message.create({
            sender,
            receiver,
            message,
            image
        });

        if(!conversation){
            conversation = await Conversation.create({
                participants: [sender, receiver],
                messages: [newMessage._id]
            });
        }else{
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        const receiverSocketId = getReceiverSocketId(receiver)
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        return res.status(201).json( newMessage );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        let sender = req.userId;;
        let {receiver} = req.params;
        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        }).populate('messages');
        if(!conversation){
            return res.status(400).json({ message: "No conversation found" });
        }
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "get Messages Error" });
    }
}
