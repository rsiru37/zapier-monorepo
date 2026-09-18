"use client"
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import {Input} from "@/components/Input";
import { useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";

export default function SignupPage(){
    const router = useRouter();
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    return(
        <div className="flex items-center justify-center">
            <form className="py-4">
                <Input label="Name" placeholder="Your Name" onChange={(e) => { setName(e.target.value)}} />
                <Input label="Email" placeholder="Your Email" onChange={(e) => { setEmail(e.target.value)}} />
                <Input label="Password" placeholder="Your Password" onChange={(e) => { setPassword(e.target.value)}} type="password" />
                <div className="py-4"><PrimaryButton onClick={async() => {
                    const res = await axios.post('http://localhost:3000/api/v1/user/signup', {name,email,password});
                    if(res.status === 201){
                        console.log("Signup successful");
                        router.push("/login");
                    }
                }}>Sign Up</PrimaryButton></div>
                
            </form>
        </div>
    )
}
