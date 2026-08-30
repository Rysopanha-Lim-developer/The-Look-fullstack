import { User, UserModel } from "../models/user.model";

export async function createNewUser(userInfo:User) {
    const {username, email, password} = userInfo;



    UserModel.create({username, email, password})
}
