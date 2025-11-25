'use client'
import { useEffect, useState } from 'react'

type Props = {
    onSelectStore?: (storeId: number | string | null, chainId?: number | string | null) => void
    onSelectChain?: (chainId: number | string | null) => void
}

function parseMaybeNumber(value: string): number | string {
    const num = Number(value)
    return Number.isNaN(num) ? value : num
}

export default function StoreDropdown({ onSelectStore, onSelectChain }: Props) {
    type store = {
        s_id?: string | number
        s_address: string
    }
    type storeChain = {
        c_id?: string | number
        c_name: string
        c_url: string
        stores: store[]
    }

    const [storeChains, setStoreChains] = useState<storeChain[]>([])
    const [error, setError] = useState("")
    const [selectedChainId, setSelectedChainId] = useState<string>("")
    const [selectedStoreId, setSelectedStoreId] = useState<string>("")

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
            try {
                body = JSON.parse(data.body)
            } catch (err) {
                console.error("Failed to parse body", err)
            }

            if (data.statusCode != 200) {
                setError(data.error || "Failed to load store chains")
            } else if (body) {
                setStoreChains(
                    body.storeChains.map((sc: any) => ({
                        c_id: sc.c_id,
                        c_name: sc.c_name,
                        c_url: sc.c_url,
                        stores: sc.store || []
                    }))
                )
            }
        } catch (err) {
            console.error("something went wrong: ", err)
            setError("Unable to load store chains")
        }
    }

    const selectedChain = storeChains.find((chain) => String(chain.c_id) === selectedChainId)
    const selectedStores = selectedChain?.stores ?? []

    return (
        <div>
            <div>
                <label htmlFor="storeChain">Store Chain</label>
                <select
                    id="storeChain"
                    value={selectedChainId}
                    onChange={(e) => {
                        const newChainId = e.target.value
                        setSelectedChainId(newChainId)
                        setSelectedStoreId("")
                        const parsedChainId = newChainId ? parseMaybeNumber(newChainId) : null
                        onSelectChain?.(parsedChainId)
                        onSelectStore?.(null, parsedChainId)
                    }}
                >
                    <option value="">Select a chain</option>
                    {storeChains.map((chain) => (
                        <option key={chain.c_id ?? chain.c_name} value={String(chain.c_id ?? chain.c_name)}>
                            {chain.c_name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="store">Store</label>
                {selectedChain && selectedStores.length === 0 ? (
                    <p>No available stores</p>
                ) : (
                    <select
                        id="store"
                        value={selectedStoreId}
                        onChange={(e) => {
                            const newStoreId = e.target.value
                            setSelectedStoreId(newStoreId)
                            onSelectStore?.(newStoreId ? parseMaybeNumber(newStoreId) : null, selectedChain?.c_id ?? null)
                        }}
                        disabled={!selectedChain || selectedStores.length === 0}
                    >
                        <option value="">Select a store</option>
                        {selectedStores.map((store) => (
                            <option key={store.s_id ?? store.s_address} value={String(store.s_id ?? store.s_address)}>
                                {store.s_address}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {error && <p>{error}</p>}
        </div>
    )
}
