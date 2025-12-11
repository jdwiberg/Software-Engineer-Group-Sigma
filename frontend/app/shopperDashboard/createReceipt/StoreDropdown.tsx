'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type StoreDropdownProps = {
    onSelectStore?: (storeId: number | string | null, chainId?: number | string | null) => void
    onSelectChain?: (chainId: number | string | null) => void
    onLoadStoreChains?: (chains: storeChain[]) => void
    c_id: string | null
    s_id: string | null
}

function parseMaybeNumber(value: string): number | string {
    const num = Number(value)
    return Number.isNaN(num) ? value : num
}

type store = {
    s_id: string
    s_address: string
}

type storeChain = {
    c_id: string
    c_name: string
    c_url: string
    stores: store[]
}

export default function StoreDropdown({ c_id, s_id, onSelectStore, onSelectChain, onLoadStoreChains }: StoreDropdownProps) {

    const [storeChains, setStoreChains] = useState<storeChain[]>([])
    const [error, setError] = useState("")
    const [selectedChainId, setSelectedChainId] = useState<string>("")
    const [selectedStoreId, setSelectedStoreId] = useState<string>("")
    const router = useRouter()

    useEffect(() => {
        showStoreChains()
    }, [])

    useEffect(() => {
        if (c_id) {
            setSelectedChainId(c_id)
            onSelectChain?.(parseMaybeNumber(c_id))
        }
        if (s_id) {
            setSelectedStoreId(s_id)
            onSelectStore?.(parseMaybeNumber(s_id), c_id ? parseMaybeNumber(c_id) : null)
        }
    }, [c_id, s_id, onSelectChain, onSelectStore])

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
                onLoadStoreChains?.(body.storeChains.map((sc: any) => ({
                        c_id: sc.c_id,
                        c_name: sc.c_name,
                        c_url: sc.c_url,
                        stores: sc.store || []
                    })))
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
                    }}>
                    <option value="">Select a chain</option>
                    {storeChains.map((chain) => (
                        <option key={chain.c_id ?? chain.c_name} value={String(chain.c_id ?? chain.c_name)}>
                            {chain.c_name}
                        </option>
                    ))}
                </select>
                <button type="button" onClick={() => router.push("/shopperDashboard?tab=stores")}>Add Store</button>
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
