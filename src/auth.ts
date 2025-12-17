import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { getDb } from './mongo/conexion';
import { ObjectId } from 'mongodb';
import {TokenPayload}from "./types"
import { COLLECTION_USERS } from './utils';
dotenv.config()


const SECRET = process.env.SECRET;




export const signToken = (userId: string) => jwt.sign({ userId }, SECRET!, { expiresIn: "1h" });


export const verifyToken = (token: string): TokenPayload | null => {
    try{
        return jwt.verify(token, SECRET!) as TokenPayload;
    }catch (err){
        return null;
    }
};

export const getUserFromToken = async (token: string) => {
    const payload = verifyToken(token);
    if(!payload) return null;
    const colleccion = getDb().collection(COLLECTION_USERS);
    return await colleccion.findOne({
        _id: new ObjectId(payload.userId)
    })
}