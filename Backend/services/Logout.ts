import { cookies } from "next/headers";


export async function Logout() {
    const session = await cookies();
    session.delete("access_token")
    session.delete("refresh_token")
}