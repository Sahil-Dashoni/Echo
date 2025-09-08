import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    let userId = req.userId;
    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    return res.status(500).json({ message: `getCurrentUser error ${error.message}` });
  }
};

export const editProfile= async (req, res) => {
  try {
    let {name, bio} = req.body;
    let image;
    if(req.file){
      image = await uploadOnCloudinary(req.file.path);
    }

    let user = await User.findByIdAndUpdate(req.userId, {name,bio, image},{new: true}).select("-password");

    if(!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({message: "Profile updated successfully", user});
  } catch (error) {
    return res.status(500).json({ message: `editProfile error ${error.message}` });
  }
}

export const getOtherUser = async (req, res) => {
  try {
    let user = await User.find({
      _id: {$ne: req.userId}
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `getOtherUser error ${error.message}` });
  }
};

export const search = async (req,res)=>{
  try {
    let {query} = req.query
    if(!query){
      return res.status(400).json({message:"query is required"})
    }
    let users = await User.find({
      $or:[
        {name:{$regex:query,$options:"i"}},
        {userName:{$regex:query,$options:"i"}},
      ]
    })
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: `search user error ${error.message}` });
  }
}