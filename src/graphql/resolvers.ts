import { IResolvers } from "@graphql-tools/utils";
import { getDb } from "../mongo/conexion";
import { ObjectId } from "mongodb";
import { insertarUsuario, comprobarContraseña} from "../collection/users";
import { signToken } from "../auth";
import { insertMovie,getMoviebyId,getMovies, deleteMovieById, addMovieUser, removeMovieUser, updateMovieByParams } from "../collection/peliculas";
import { User } from "../types";
import { COLLECTION_MOVIES, COLLECTION_USERS } from "../utils";





export const resolvers:IResolvers = {
    User :{
        mi_lista:async(parent: User) =>{
            const db = getDb()
            const ids = (parent.mi_lista || []).map((id) => new ObjectId(id))
            const lista = await db.collection(COLLECTION_MOVIES).find({_id:{$in:ids}}).toArray()
            return lista
        }
    },
    Query :{
        me: async (_, __, { user }) => {
            if (!user) return null;
            return user
        },
        getMovie: async (_,{id})=>{
            return await getMoviebyId(id)
        },
        getMovies:async (_, {page, size}) =>{
            return await getMovies(page,size)
        }
    },
    Mutation :{
        register: async (_, {  email, password }) => {
            const userId = await insertarUsuario(email, password);
            return signToken(userId)
        },

        login: async (_, { email, password }) => {
            const user = await comprobarContraseña(email, password);
            if (!user) {
                throw new Error("Credenciales incorrectas");
            }
            return signToken(user._id.toString())
        },
        addMovie:async(_,{title, length,date,format},{user}) =>{
            if(!user)throw new Error("Debes logearte")
            return await insertMovie(title,length,date,format)
        },
        deleteMovie:async(_,{id},{user})=>{
            if(!user)throw new Error("Debes logearte primero")
            return await deleteMovieById(id)
        },
        addMovieToUser:async(_,{idMovie},{user})=>{
            console.log(user)
            if(!user)throw new Error("Debes logearte primero")
            return await addMovieUser(idMovie,user._id.toString())
        },
        remoteMovieFromUser:async(_,{idMovie},{user})=>{
            if(!user)throw new Error("Debes logearte primero")
            return await removeMovieUser(idMovie,user._id.toString())
        },
        updateMovie:async(_,{id,title, length,date, format},{user})=>{
            if(!user)throw new Error("Debes logearte primero")
            return await updateMovieByParams(id,title,length,date,format)
        }
        
    }
}