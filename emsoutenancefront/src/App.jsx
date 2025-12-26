"use client"

import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Features from "./components/Features"
import RoleCards from "./components/RoleCards"
import Footer from "./components/Footer"

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <Navbar />

      <div className="animate-fade-in-up">
        <Hero />
        <Features />
        <RoleCards />
      </div>

      <Footer />
    </div>
  )
}
