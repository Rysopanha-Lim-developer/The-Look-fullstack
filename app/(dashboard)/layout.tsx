import React from "react";
import Link from "next/link";


export default function DashboardLayout({children}: {children: React.ReactNode}){
    return(
        <>
            <header>
                
            </header>
            <main>
                {children}
            </main>
            <footer>

            </footer>
        </>
    )
}