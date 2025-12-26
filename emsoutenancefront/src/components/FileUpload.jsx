import { useState } from "react"

export default function FileUpload({ onFileSelect }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    
    if (!selectedFile) {
      setFile(null)
      return
    }
    
    // Vérification de la taille (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Le fichier est trop volumineux (max 10MB)")
      setFile(null)
      return
    }
    
    // Vérification du type de fichier
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Format de fichier non supporté (PDF ou DOCX uniquement)")
      setFile(null)
      return
    }
    
    setError("")
    setFile(selectedFile)
    if (onFileSelect) onFileSelect(selectedFile)
  }

  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.docx"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-2 text-sm text-gray-300">
              <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
            </p>
            <p className="text-xs text-gray-500">PDF ou DOCX (MAX. 10MB)</p>
          </div>
        </label>
      </div>
      
      {file && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm truncate max-w-xs">{file.name}</span>
          </div>
          <button 
            onClick={() => {
              setFile(null)
              if (onFileSelect) onFileSelect(null)
            }}
            className="text-red-400 hover:text-red-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
