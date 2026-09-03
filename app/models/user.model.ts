"use server"

import {Schema, model, models} from "mongoose";
import bcrypt from "bcrypt";//This is for hashing password

export type User = {
    username: string,
    email: string,
    password: string,
};

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


const UserSchema = new Schema<User>(
    {
        username:{
            type:String, 
            required: [true, "Username is required"],     
            minlength:[5, "Username must be at lease 5 characters"], 
            maxlength:[12, "Username must not exced 12 characters"],
            unique: true,
        }, 
        email:{
            type:String,
            required: [true, 'Email address is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [emailRegex, 'Please fill a valid email address']
        },
        password:{
            type:String,
            required: [true, 'Password is required'],
            unique: true,
            trim: true,
            minlength:[4, "Password must be at lease 4 characters"], 
            maxlength:[8, "Password must not exced 8 characters"],
        }
    }, 
    { 
        timestamps: true 
    }
);

UserSchema.pre("save", async function(next){
    if(this.isModified("password")){
         this.password = await bcrypt.hash(this.password, 10)/*The 10 (Salt Rounds): This is the cost factor. It tells bcrypt to run its internal math loop 2¹⁰ (which is 1,024) times.  */
    }
})

UserSchema.index({username: 1, email: 1});


export const UserModel = models.UserModel || model("UserModel", UserSchema, "users")