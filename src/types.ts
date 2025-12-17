import { ObjectId } from "mongodb";

export type TokenPayload = {
    userId: string;
}



export type User ={
    _id?: ObjectId,
    email: string,
    password: string,
    mi_lista: string[]
}

export type Movie ={
    _id?: ObjectId,
    title: string,
    length: number,
    date: string,
    format: string
}