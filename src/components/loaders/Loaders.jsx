import { useGSAP } from "@gsap/react"
import gsap from "gsap";

function Loaders() {
    useGSAP(() => {
        gsap.from(".loaderh1Anim", {
            y: -40,
            stagger: 0.15,
            yoyo: true,
            repeat: -1,
            duration: .5,
            ease: "power1.inOut"
        })
    })

  return (
    <div className="w-full h-screen bg-mainBgColor flex justify-center items-center">
      <h1 className="loaderh1Anim uppercase text-borderColor font-pacifico text-4xl tracking-widest">p</h1>
      <h1 className="loaderh1Anim uppercase text-borderColor font-pacifico text-4xl tracking-widest">z</h1>
    </div>
  )
}

export default Loaders
