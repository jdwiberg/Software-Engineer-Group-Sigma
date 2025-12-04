'use client'
import { useState } from "react"
import ReceiptForm from "./ReceiptForm"
import PhotoDropZone from  './Dropbox'

export default function CreateReceiptPage() {
  const [submitted, setSubmitted] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(false)
  const [file, setFile] = useState<string | null>(null)
  
  const toggleAi = () => {
    setAiEnabled(!aiEnabled)
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const aiHandleFile = (file: File) => {
    console.log("File selected: ", file)
  }

  return (
    <div>
      <h1>Create Receipt</h1>
      <p>Fill out the form below to create a new receipt or <button type="button" onClick={() => toggleAi()}>USE AI</button></p>
      {aiEnabled && <PhotoDropZone onFileSubmitted={aiHandleFile}/>}
      {!submitted ? (
      <ReceiptForm onSubmit={handleSubmit} />
      ) : (
        <p>Receipt submitted successfully!</p>
      )}
    </div>
  )
}