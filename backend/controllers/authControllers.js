import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../config/token.js';

export const signUp = async (req, res) => {
    const {userName, email, password} = req.body;

    try {
        const checkUser = await User.findOne({ userName });
        if (checkUser) {
            return res.status(400).json({ message: "userName already exists" });
        }

        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if(password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            userName,
            email,
            password: hashedPassword
        });

        const token = await generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",
            secure: false,
            maxAge: 6 * 60 * 60 * 1000 // 6 hours
        });

        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({ message: `Error creating user ${error}` });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = await generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",
            secure: false,
            maxAge: 6 * 60 * 60 * 1000 // 6 hours
        });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ message: `Error logging in ${error}` });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Error logging out ${error}` });
    }
};