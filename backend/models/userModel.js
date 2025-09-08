import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    bio: { 
        type: String, 
        default: "Hey Everyone, I am using Echo." 
    },

    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
