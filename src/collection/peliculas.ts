import { ObjectId } from "mongodb"
import { getDb } from "../mongo/conexion"
import { Movie, User } from "../types"
import { COLLECTION_MOVIES , COLLECTION_USERS} from "../utils"


export const insertMovie = async(title: string,length: number, date: string, format: string) =>{
    const db = getDb()

    const comprobar = await db.collection(COLLECTION_MOVIES).findOne({title})
    if(comprobar) return new Error("Esa peli ya esta metida")

    const insertado = await db.collection(COLLECTION_MOVIES).insertOne({
        title,
        length,
        date,
        format
    })
    if(!insertado) return null

    return {
        _id: insertado.insertedId,
        title,
        length,
        date,
        format
    }
}

export const getMoviebyId = async (id: string) =>{
    const db = getDb()
    const peli = await db.collection<Movie>(COLLECTION_MOVIES).findOne({_id: new ObjectId(id)})
    if(!peli) throw new Error("Error al elegir peli")
    return peli
}
export const getMovies= async (page?: number, size?: number) =>{
    const db = getDb();
    page = page || 1;
    size = size || 10;
    return await db.collection(COLLECTION_MOVIES).find().skip((page - 1) * size).limit(size).toArray();
}

export const deleteMovieById = async(id: string) =>{
    const db = getDb()
    const eliminado = await db.collection(COLLECTION_MOVIES).deleteOne({_id: new ObjectId(id)})
    if(!eliminado)throw new Error("No se ha encontrado dicha peli")
    
    const movies = await getMovies(0,0)
    return movies
}
export const addMovieUser = async(idMovie: string, idUser: string)=>{
    const db = getDb()

    const peli = await db.collection(COLLECTION_MOVIES).findOne({_id: new ObjectId(idMovie)})
    console.log(peli)
    await db.collection<User>(COLLECTION_USERS).updateOne(
        {_id: new ObjectId(idUser)},
        {$addToSet:{mi_lista: idMovie}}
    )
    const modificado =  await db.collection(COLLECTION_USERS).findOne({_id: new ObjectId(idUser)})
    if(!modificado)throw new Error("Error al modificar")
    return modificado
}

export const removeMovieUser = async(idMovie: string, idUser: string)=>{
    const db = getDb()
    
    const userid = new ObjectId(idUser)
    await db.collection<User>(COLLECTION_USERS).updateOne(
        {_id: new ObjectId(idUser)},
        {$pull: {mi_lista: idMovie}}
    )
    return await db.collection(COLLECTION_USERS).findOne({_id: new ObjectId(idUser)})
}


export const updateMovieByParams = async(id: string,title ?: string, length ?:number, date ?: string, format ?:string)=>{
    const db = getDb()
    let updated :any = {}
    if(title) updated.title = title
    if(length) updated.length = length
    if(date) updated.date = date
    if(format) updated.format = format

    const modified = await db.collection(COLLECTION_MOVIES).updateOne(
        {_id: new ObjectId(id)},
        {$set: updated}
    )
    if(!modified)throw new Error("La peli no se ha encontrado")
    const peliculaModificada = await getMoviebyId(id)
    return peliculaModificada
}