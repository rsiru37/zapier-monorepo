"use client"
import { PrimaryButton } from "./buttons/PrimaryButton"
import { useRouter } from "next/navigation";
import { SecondaryButton } from "./buttons/SecondaryButton";

function Hero():React.ReactElement {
    const router = useRouter();
    return (<div>
        <div className="flex flex-col items-center justify-center pt-8">
            <h1 className="text-8xl font-bold">Welcome to Zapier</h1>
            <p className="mt-4 text-6xl">Automate as fast as you can type</p>
        </div>
        <div className="flex justify-center pt-3">
            <div className="mt-4 text-2xl text-center">Zapier gives teams one place to set guardrails, manage model access, and see everything — so everyone can build with AI confidently, on any model, without waiting for permission.</div>
        </div>
        <div className="flex justify-center">
            <div className="flex pt-6">
                <PrimaryButton size="big" onClick={() => {router.push('/signup')}}>Get Started for Free</PrimaryButton>
                <div className="pl-4">
                    <SecondaryButton size= "big" onClick={() => {}}>Contact Sales</SecondaryButton>
                </div>
            </div>
        </div>
        </div>
    )
}
export { Hero }