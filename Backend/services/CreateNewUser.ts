import { UserModel } from "@/Backend/models/user.model";
import { dbConnection } from "@/Backend/lib/dbConnection";
import z from "zod";
import { HttpError } from "@/Backend/lib/errors";

//Need to add function to create cookies after register

export const registerSchema = z.object({
    username: z.string().min(5, "Username must be at least 5 characters").max(12, "Username must be at most 12 characters"),
    email: z.email(),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(10, "Password must be at most 10 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});


export async function CreateNewUser(body:unknown) {
        const checkedInput = registerSchema.safeParse(body)
        if (!checkedInput.success) {
            const { fieldErrors } = z.flattenError(checkedInput.error);
            const allMessages = Object.values(fieldErrors).flat(); //convert the obj above to array for display
            throw new HttpError("Please check your input", 400, { errors: allMessages });
        }

        const {username, email, password} = checkedInput.data;

        await dbConnection();
        const existedUser = await UserModel.findOne({
            $or: [{ username: username }, { email: email }]
        });
        if (existedUser) {
            if (existedUser.username === username) {
                throw new HttpError("Username already existed. Please choose another username.", 403);
            }
            if (existedUser.email === email as string) {
                throw new HttpError("Email has been used. Please use another email.", 403);
            }
        }
        await UserModel.create({username, email, password});

        return { message: "Registered successfully" };
}
