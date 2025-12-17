import bcrypt from "bcryptjs";
import { getDb } from "../mongo/conexion";
import { ObjectId } from "mongodb";
import {COLLECTION_USERS } from "../utils";

export const insertarUsuario =async(email:string,password:string)=>{
    const db=getDb()
    const encriptada = await bcrypt.hash(password,10)

    const result = await db.collection(COLLECTION_USERS).insertOne({
        email,
        password:encriptada,
        mi_lista: []
    })

    return result.insertedId.toString()
}

export const comprobarContraseña =async (email:string,password:string)=>{
    const db=getDb()
    const usuario =await db.collection(COLLECTION_USERS).findOne({email})
    if(!usuario){
        return null
    }

    const comparar = await bcrypt.compare(password,usuario.password)

    if(!comparar){
        return null
    }

    return usuario
}

export const filtrarUsuario = async (id: string) => {
    const db = getDb();
    return await db.collection(COLLECTION_USERS).findOne({_id: new ObjectId(id)})
}