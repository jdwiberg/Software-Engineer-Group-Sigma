'use client'
import { FormEvent, useEffect, useState } from 'react'


export default function Stores() {
    type storeChain = {
        c_name: string,
        c_url: string,
        stores: store[]
    }
    type store = {
        s_address: string
    }

    const [storeChains, setStoreChains] = useState<storeChain[]>([])
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [adding, setAdding] = useState(false)
    const [chainName, setChainName] = useState("")
    const [chainUrl, setChainUrl] = useState("")

    async function addStoreChain(c_name: string, c_url: string) {
        try {
            const res = await fetch(
            "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/addStoreChain",
                {
                    method: "POST",
                    body: JSON.stringify({ c_name, c_url })
                }
        )
            const data = await res.json()

            let body 
            try {
                body = JSON.parse(data.body);
            } catch (err) {
                console.error("Failed to parse body", err);
            }

            if (data.statusCode != 200) {
                setError(data.error)
                setMessage("Incorrect username or password, please try again.")
            } else {
                setMessage(body.message)
                showStoreChains()
            }
        } catch (err) {
            console.error("something went wrong: ", err);
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setError("")
      setMessage("")
      await addStoreChain(chainName, chainUrl)
      setAdding(false)
      setChainName("")
      setChainUrl("")
    }

    useEffect(() => {
        showStoreChains()
    }, [])

    async function showStoreChains() {
        try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/getStoreChains",
              {
                  method: "GET"
              }
          )
          
          const data = await res.json()
  
          let body
          let result
          try {
            body = JSON.parse(data.body);
            result = body.storeChains
          } catch (err) {
            console.error("Failed to parse body", err);
          }
  
          if (data.statusCode != 200) {
              setError(data.error)
          } else {
              setMessage(body.message)
              setStoreChains(
                body.storeChains.map((sc: any) => ({
                    c_id: sc.c_id,
                    c_name: sc.c_name,
                    c_url: sc.c_url,
                    stores: sc.store
                }))
              )
          }
      } catch (err) {
          console.error("something went wrong: ", err);
      }
    
    }

    return (
    <div>
        <button disabled={adding} onClick={() => setAdding(true)}>Add Store Chain</button>
        {adding && (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="chainName">Chain Name</label>
                    <input
                      id="chainName"
                      type="text"
                      value={chainName}
                      onChange={(e) => setChainName(e.target.value)}
                      required
                    />
                </div>
                <div>
                    <label htmlFor="chainUrl">Chain URL</label>
                    <input
                      id="chainUrl"
                      type="url"
                      value={chainUrl}
                      onChange={(e) => setChainUrl(e.target.value)}
                      required
                    />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setAdding(false)}>Cancel</button>
            </form>
        )}
        {storeChains.length > 0? (
            storeChains.map((chain: any) => (
            <div key={chain.c_id}>
                <h2>{chain.c_name}</h2>
                <a href={chain.c_url}>{chain.c_url}</a>
                <ul>
                {chain.stores.length > 0 ? (
                    chain.stores.map((store: any) => (
                    <li key={store.s_id}>{store.s_address}</li>
                ))) : (
                    <p>No Stores for this Chain Yet!</p>
                )}
                </ul>
            </div>
            ))
        ) : (
            <p>No Stores Yet!</p>
        )}
    </div>
    )
}
