'use client';
import { useEffect, useState } from 'react';



type Store = {
  s_id: number;
  s_address: string;
  revenue: number;
};

type StoreChain = {
  c_id: number;
  c_name: string;
  c_url: string;
  stores: Store[];
};


export default function Stores() {
  const [storeChains, setStoreChains] = useState<StoreChain[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch chains AND their stores
  async function showStoreChains() {
        try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/getStoreChains",
              {
                  method: "GET"
              }
          )
          
          const data = await res.json()
          console.log("Raw API response:", data)
  
          let body: any = {};
          try {
            body = JSON.parse(data.body);
            console.log("Parsed body:", body)
          } catch (err) {
            console.error("Failed to parse body", err);
            body = {};
          }
  
          if (data.statusCode != 200) {
              setError(body?.error || data.error || "Failed to fetch store chains")
          } else {
              setMessage(body?.message || "")
              const chains = (body?.storeChains || []).map((sc: any) => ({
                    c_id: sc.c_id,
                    c_name: sc.c_name,
                    c_url: sc.c_url,
                    stores: (sc.store || []).map((store: any) => {
                      console.log("Store object:", store)
                      return {
                        s_id: store.s_id,
                        s_address: store.s_address,
                        revenue: store.revenue ?? 0,
                      }
                    }),
                }))
              console.log("Mapped chains:", chains)
              console.log("Full chain details:", JSON.stringify(chains, null, 2))
              setStoreChains(chains)
          }
      } catch (err) {
          console.error("something went wrong: ", err);
          setError("Network error fetching store chains");
      }
    
    }

  const deleteStore = async (s_id: number) => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(
        'https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/removeStore',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ s_id })
        }
      );

      const data = await res.json();
      let body;
      try {
        body = data.body ? JSON.parse(data.body) : {};
      } catch (err) {
        console.error('Failed to parse delete response body', err);
      }

      if (data.statusCode !== 200) {
        setError(body?.error || 'Failed to delete store');
      } else {
        setMessage(body?.message || 'Store deleted');
        await showStoreChains(); // Refresh list after delete
      }
    } catch (err) {
      console.error('Delete store error: ', err);
      setError('Network error or invalid request');
    }
  };

  const deleteStoreChain = async (c_id: number) => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(
        'https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/removeStoreChain',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ c_id })
        }
      );

      const data = await res.json();
      let body;
      try {
        body = data.body ? JSON.parse(data.body) : {};
      } catch (err) {
        console.error('Failed to parse delete chain response body', err);
      }
      if (data.statusCode !== 200) {
        setError(body?.error || 'Failed to delete store chain');
      } else {
        setMessage(body?.message || 'Store chain deleted');
        await showStoreChains(); // Refresh list after delete
      } 
    } catch (err) {
      console.error('Delete store chain error: ', err);
      setError('Network error or invalid request');
    }
  };

  useEffect(() => {
    showStoreChains();
  }, []);

  return (
    <div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {storeChains.length === 0 ? (
        <p>No store chains found.</p>
      ) : (
        storeChains.map((chain) => (
          <div key={chain.c_id} className="border-b mb-4 pb-2">


            {/* Chain heading */}
            <h2 className="font-semibold">{chain.c_name + "  "}
            <button 
                    className="text-red-600 ml-4"
                    onClick={() => deleteStoreChain(chain.c_id)}
                  >Delete</button>
            </h2>
            <h3>
              {(() => {
              const totalRevenue = chain.stores.reduce((sum, store) => sum + (store.revenue ?? 0), 0);
              return (
                <div>
                  Total Revenue: ${totalRevenue.toFixed(2)}
                </div>
              );
            })()}
          </h3>
              
            
            {chain.c_url && (
              <a href={chain.c_url} className="text-blue-600 underline">
                {chain.c_url}
              </a>
            )}

            {/* Stores under this chain */}
            {chain.stores.length > 0 ? (
              <ul className="pl-6 mt-2 list-disc">
                {chain.stores.map((store) => (
                  <li key={store.s_id} className="flex justify-between items-center">

                    <span>{store.s_address}</span>
                    
                    <button
                      className="text-red-600 ml-4"
                      onClick={() => deleteStore(store.s_id)}
                    >Delete</button>

                  </li>
                ))}
              </ul>
            ) : (
              <p className="ml-6">No stores in this chain</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
