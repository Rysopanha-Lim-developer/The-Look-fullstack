import { cookies } from "next/headers";


export async function Logout() {
    const session = await cookies();
    session.delete("session")
}