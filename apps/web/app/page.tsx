import Image from "next/image";
import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/Hero";
import { HeroVideo } from "@/components/HeroVideo";


export default function Home():React.ReactElement {
  return (
      <main className="pb-40">
        <Hero/>
        <div className="pt-4">
        <HeroVideo/>
        <b>Hi Raj</b>
        </div>
      </main>
  );
}
