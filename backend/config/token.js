import jwt from 'jsonwebtoken';

const generateToken = async (userId) => {
    try {
        const token = await jwt.sign({userId }, process.env.JWT_SECRET, { expiresIn: '6h' });
        return token;
    } catch (error) {
        console.error("Error generating token", error);
    }
};

export default generateToken;
