

import "server-only" //Run npm install server-only, this help check for server code leak to client side

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI){
    throw new Error("Please provide a vaild URI");
}

type MongooseCache = {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

declare global{
    var mongooseCache: MongooseCache | undefined
}

let cached = global.mongooseCache;
if(!cached){
    cached = global.mongooseCache =   {
                                    conn:  null,
                                    promise:  null
                                }
}

export async function dbConnection():Promise<typeof mongoose> {
    if(cached!.conn){
        return cached!.conn;
    }

    if(!cached!.promise){
        const options = {
            bufferCommands: false
        }

        cached!.promise = mongoose.connect(MONGODB_URI as string, options);
    };

    try {
        cached!.conn = await cached!.promise;
    } catch (error) {
        cached!.promise = null;
        throw new Error("Cannot make connection to Database")
    }

    return cached!.conn
}