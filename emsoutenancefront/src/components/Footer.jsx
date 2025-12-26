export default function Footer() {
  return (
    <footer className=" mt-20 py-12 px-4 sm:px-6 lg:px-8">
     
        

        <div className="border-t border-[#2d3748] pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-[#a0aec0] text-sm">© 2025 EMSoutenance. Tous droits réservés.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="text-[#a0aec0] hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="text-[#a0aec0] hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-[#a0aec0] hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
     
    </footer>
  )
}
