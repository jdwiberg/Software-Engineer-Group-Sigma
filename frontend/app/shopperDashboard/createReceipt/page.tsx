'use client'
import { useState } from "react"
import StoreDropdown from './StoreDropdown'
import ReceiptForm from "./ReceiptForm"
import PhotoDropZone from  './Dropbox'
import { useRouter } from 'next/navigation';
import OpenAI from 'openai'
import sys_prompt from "./sys_prompt"

type receiptItem = {
    i_name : string,
    i_category: string,
    quantity: number,
    i_price: number
}

type fromAI = {
    c_name : string,
    s_address : string,
    items : receiptItem[]
}

export default function CreateReceiptPage() {
  const [aiReceipt, setAiReceipt] = useState<fromAI | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(false)
  const router = useRouter();

  
  const toggleAi = () => {
    setAiEnabled(!aiEnabled)
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const aiHandleFile = async (file: File, apiKey: string) => {
    setAiEnabled(false)
    setLoading(true)
    console.log("File selected: ", file)
    if (!apiKey) {
      setError("Missing API key")
      setLoading(false)
      return
    }
    try {
      // Encode image file
      const encoded = await Base64Encode(file)
      console.log("Encoded")

      const client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      })

      const response = await client.responses.create(
        ({
          model: 'gpt-4o-mini',
          input: [
            {
              role: 'system', content: [
                {
                  type: 'input_text',
                  text: sys_prompt,
                },
              ],
            },
            {
              role: "user", content: [
                {
                  type: 'input_text',
                  text: "Here is the image of a receipt Base64 Encoded"
                },
                {
                  type: "input_image",
                  image_url : `data:image/png;base64,${encoded}`,
                },
              ],
            },
          ],
          max_output_tokens: 500,
        } as any)
      )


      const msg = response.output_text
      const json = parse(msg)
      if (!json || Object.keys(json).length === 0 || !Array.isArray(json.items) || json.items.length === 0) {
        setError("Image is not of a receipt")
        setLoading(false)
        return
      }

      const items = json.items.map((item:any) => ({
        i_name: String(item.i_name),
        i_category: String(item.i_category),
        quantity: Number(item.quantity),
        i_price: Number(item.i_price),
      }))
    
      const mapped =  {
        c_name: json.c_name,
        s_address: json.s_address,
        items,
      }

      setAiReceipt(mapped)
      setLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("There was an error here")
      }
      setAiReceipt(null)
      setLoading(false)
    }
    
  }

  const parse = (msg: any) => {
      let json: any = {}
      try {
        if (typeof msg === "string") {
          json = JSON.parse(msg)
        } else if (Array.isArray(msg)) {
          const combined = (msg as any[]).map((part: any) => part?.text ?? "").join("")
          json = combined ? JSON.parse(combined) : {}
        } else if (msg && typeof (msg as any).parsed !== "undefined") {
          json = (msg as any).parsed
        }
      } catch {
        json = {}
      }
      return json
  }

  const Base64Encode = (file: File): Promise<string> => {
    return new Promise ((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64string = reader.result as string
        resolve(base64string.split(',')[1])
      }
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div>
      <button type="button" onClick={() => router.push("./")}>Back</button>
      <h1>Create Receipt</h1>
      {error && <div>{error}</div>}
      <div>Fill out the form below to create a new receipt or
        <button type="button" onClick={() => toggleAi()}>USE AI</button>
      </div>
      {loading && <div>Loading AI Receipt...</div>}
      {aiEnabled && <PhotoDropZone onFileSubmitted={aiHandleFile}/>}
      {!submitted ? (
      <ReceiptForm aiReceipt={aiReceipt} onSubmit={handleSubmit} />
      ) : (
        <p>Receipt submitted successfully!</p>
      )}
    </div>
  )
}
