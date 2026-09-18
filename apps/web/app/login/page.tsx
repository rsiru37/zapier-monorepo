"use client"
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import {Input} from "@/components/Input";
import { useState } from "react";
import axios from "axios";
import { env } from "process";
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const router = useRouter();
    return(
        <div className="flex items-center justify-center">
            <form className="py-4">
                <Input label="Email" placeholder="Your Email" onChange={(e) => { setEmail(e.target.value)}} />
                <Input label="Password" placeholder="Your Password" onChange={(e) => { setPassword(e.target.value)}} type="password" />
                <div className="py-4"><PrimaryButton onClick={async () => {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signin`, {email,password});
                    if(res.status == 200){
                        localStorage.setItem("token", res.data.token);
                        router.push("/dashboard");
                    }
                }}>Log In</PrimaryButton></div>
            </form>
        </div>
    )
}
