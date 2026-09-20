"use client"
// This need to update the form to match the new register format
import { useState } from "react"
import { useRouter } from "next/navigation";

import { ApiFeedback } from "@/Backend/lib/Types/generalTypes.module";


export default function LoginPage(){
    const route = useRouter()

    let [username, setUsername] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    let [apiFeedback, setApiFeedback] = useState<ApiFeedback | any>({});
    let [apiStatus, setApiStatus] = useState(0);

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEmailValid = emailRegex.test(email);

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
    async function handelLogin(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, email, password})
        });
        const apiFeedback = await res.json();
        setApiFeedback(apiFeedback)
        setApiStatus(res.status)
        if(res.ok){
            route.refresh();
            route.push("/");
        }
    }
    return(
        <section className="w-full h-100% flex flex-col items-center justify-start">
            <h1>Welcome to The Look</h1>
            <h2>Login to your account</h2>
            <article className="w-[70%] h-[90dvh] flex flex-col justify-start items-center gap-y-4">
                <form onSubmit={handelLogin} 
                    className="w-[50%] rounded-lg border-2 px-2.5 py-5 flex flex-col gap-2.5 bg-[rgb(255,255,255)]">
                    <div className="w-full flex flex-col justify-between gap-1">
                        <label className="w-[30%]" htmlFor="username">Username</label>
                        <div className="flex flex-col w-[70%] justify-center items-end">
                            <input type="text" name="username" className="rounded-sm w-full px-1" minLength={5} maxLength={12} required value={username} placeholder="thelook123" onChange={handleChangeUsername} 
                            style={
                                {
                                    border: username.length === 0 ? `1.5px solid black` :
                                            apiFeedback.message == "Username not found"? `1.5px solid rgb(220, 38, 38)`:
                                            username.length < 5 ? `1.5px solid rgb(220, 38, 38)` : 
                                            `1.5px solid rgb(22, 163, 74)`
                                }
                            } />
                            <p className="text-xs self-start" 
                                style={
                                    {
                                        color: username.length === 0 ? `black` :
                                            apiFeedback.message == "Username not found"? `rgb(220, 38, 38`: 
                                            username.length < 5 ? `rgb(220, 38, 38)` :
                                            `rgb(22, 163, 74)`
                                    }
                                }>
                                    {apiFeedback.message == "Username not found"? "Username not found" : "Username must be between 5 characters and 12 characters"}
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex flex-col justify-between gap-1">
                        <label className="w-[30%]" htmlFor="email">Email</label>
                        <div className="flex flex-col w-[70%] justify-center items-end">
                            <input type="email" name="email" className="rounded-sm w-full px-1" required value={email} placeholder="thelook168@gmail.com" onChange={handleChangeEmail}
                            style={
                                {
                                    border: email.length === 0 ? `1.5px solid black` :
                                            apiFeedback.message == "Email not found"? `1.5px solid rgb(220, 38, 38)`:
                                            isEmailValid ? `1.5px solid rgb(22, 163, 74)`:
                                            `1.5px solid rgb(220, 38, 38)`
                                }
                            }
                            />
                            <p className="text-xs self-start" 
                                style={
                                    {
                                    color: email.length === 0 ? `black` :
                                            apiFeedback.message == "Email not found"? `rgb(220, 38, 38)`:
                                            isEmailValid ? `rgb(22, 163, 74)`:
                                            `rgb(220, 38, 38)`
                                    }
                                }>
                                    {apiFeedback.message == "Email not found"? "Email not found" : "Please enter your email address"}
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex flex-col justify-between gap-1">
                        <label className="w-[30%]" htmlFor="password">Password</label>
                        <div className="flex flex-col w-[70%] justify-center items-end">
                            <input type="text" name="password" className="rounded-sm w-full px-1" minLength={4} maxLength={8} required value={password} placeholder="theLook4EV" onChange={handleChangePassword}  
                            style={
                                {
                                    border: password.length === 0 ? `1.5px solid black` :
                                            apiFeedback.message == "Incorrect password"? `1.5px solid rgb(220, 38, 38)`:
                                            password.length < 4 ? `1.5px solid rgb(220, 38, 38)` : 
                                            `1.5px solid rgb(22, 163, 74)`
                                }
                            } />
                            <p className="text-xs self-start" 
                                style={
                                    {
                                    color: password.length === 0 ? `black` :
                                            apiFeedback.message == "Incorrect password"? `rgb(220, 38, 38)`:
                                            password.length < 4 ? `rgb(220, 38, 38)` : 
                                            `rgb(22, 163, 74)`  
                                    }
                                }>
                                    {apiFeedback.message == "Incorrect password"? "Incorrect password" : "Password must be between 4 characters and 8 characters"}
                            </p>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="btn px-5">
                            Login
                        </button>
                    </div>
                </form>
                <div>
                    {
                        apiStatus != 0 ?  <p>{apiFeedback.message} {apiStatus}</p> : <p></p>
                    }
                </div>
            </article>
        </section>
    )
}