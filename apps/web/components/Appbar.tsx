"use client"
import { LinkButton } from "./buttons/LinkButton"
import { useRouter } from "next/navigation"
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Appbar = () => {
    const router = useRouter();
    return(
    <div className="flex border-b justify-between">
        <div className="flex flex-col justify-center p-6 text-2xl" >
            Zapier
        </div>
        <div className="flex">
            <div className="pr-4 py-2">
            <LinkButton onClick={() => {}}>Contact Sales</LinkButton>
            </div>
            <div className="pr-4 py-2">
            <LinkButton onClick={() => {router.push('/login')}}>Login</LinkButton>
            </div>
            <div className="pr-4 py-2 flex flex-col justify-center">
                <PrimaryButton size="small" onClick={() => {router.push('/signup')}}>Signup</PrimaryButton>
            </div>
        </div>
    </div>
    )
    }