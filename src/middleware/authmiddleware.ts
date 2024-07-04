import { Response, NextFunction } from 'express';
import { CustomRequest } from '../interface/user.interface';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
dotenv.config();

const Verifytoken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('JWT_SECRET_KEY is not defined');
    }
    
    try {
        const decoded = jwt.verify(token, secretKey) as { _id: ObjectId };
        req.user = decoded;
        req.uId = decoded._id;
        
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default Verifytoken;