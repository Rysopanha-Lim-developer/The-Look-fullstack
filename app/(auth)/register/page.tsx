"use client"

import { useState } from "react"
import { ApiFeedback } from "@/app/lib/Types/generalTypes.module";


export default function RegisterPage(){
    let [username, setUsername] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [apiFeedback, setApiFeedback] = useState<ApiFeedback | null>(null);

    function handleChangeUsername(e:any){
        setUsername(e.target.value);
    };
    function handleChangeEmail(e:any){
        setEmail(e.target.value);
    };
    function handleChangePassword(e:any){
        setPassword(e.target.value);
    };

    //async & await is usable anywhere except when you try to use it as client component directly
    async function handelRegister(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        const res = await fetch("/api/create-account", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, email, password})
        });
        const apiFeedback = await res.json();
        setApiFeedback(apiFeedback)
    }
    return(
        <section className="w-full h-dvh flex flex-col items-center justify-start">
            <h1>Welcome to The Look</h1>
            <h2>Please register here</h2>
            <article className="w-[70%] h-[90dvh] flex justify-center items-start">
                <form onSubmit={handelRegister} 
                    className="w-[50%] rounded-lg border-2 px-2.5 py-5 flex flex-col gap-2.5 bg-[rgb(255,255,255)]">
                    <div className="w-full flex justify-between gap-5">
                        <label className="w-[30%]" htmlFor="username">Username</label>
                        <input type="text" name="username" className="rounded-sm w-[70%] px-1" minLength={5} maxLength={12} required value={username} onChange={handleChangeUsername}/>
                    </div>
                    <div className="w-full flex justify-between gap-5">
                        <label className="w-[30%]" htmlFor="email">Email</label>
                        <input type="email" name="email" className="rounded-sm w-[70%] px-1" required value={email} onChange={handleChangeEmail}/>
                    </div>
                    <div className="w-full flex justify-between gap-5">
                        <label className="w-[30%]" htmlFor="password">Password</label>
                        <input type="text" name="password" className="rounded-sm w-[70%] px-1" minLength={4} maxLength={8} required value={password} onChange={handleChangePassword}/>
                    </div>
                    <div>
                        <button type="submit" className="btn">
                            Create account
                        </button>
                    </div>
                </form>
            </article>
            <div>
                <p>{apiFeedback?.message}</p>
                <p>{apiFeedback?.status}</p>
            </div>
        </section>
    )
}