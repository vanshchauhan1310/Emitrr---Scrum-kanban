import Image from "next/image"
import { Button } from "../components/ui/button"
import Link from "next/link"




export default function Home() {
  return (
   <div className="min-h-screen">
    <section className="container mx-auto py-20 text-center">
      <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">Streamline Your work <br/>
      
      <span className="flex mx-auto gap-3 sm:gap-4 items-center py-3">        
        with{" "} <Image 
        src={"/logo2.png"} 
        alt="Scrum Board Logo"
        width={400}
        height={80}
        className="h-14 sm:h-24 w-auto object-contain "
        />
      </span>
      </h1>

      <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">Empower Youe team with our intuitive project managaement </p>

      <Link href="/onboarding">
      <Button variant="outline" className="rounded-full">
      Get Started
      </Button>
      </Link>
    </section>
   </div>
  );
}
