import { IResolvers } from "@graphql-tools/utils";
import { getDb } from "../mongo/conexion";
import { ObjectId } from "mongodb";
import { insertarUsuario, comprobarContraseña} from "../collection/users";
import { signToken } from "../auth";
import { insertMovie,getMoviebyId,getMovies } from "../collection/peliculas";





export const resolvers:IResolvers = {
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
        }
        
    }
}