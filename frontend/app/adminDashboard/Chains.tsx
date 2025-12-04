'use client';
import { useEffect, useState } from 'react';

type Store = {
  s_id: number;
  s_address: string;
};

type StoreChain = {
  c_id: number;
  c_name: string;
  c_url: string;
  stores: Store[];
};

export default function Chains() {
  const [storeChains, setStoreChains] = useState<StoreChain[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all chains from server
  const fetchChains = async () => {
    try {
      const res = await fetch(
        'https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/getStoreChains',
        { method: 'GET' }
      );
      const data = await res.json();
     setStoreChains(
      body.storeChains.map((sc: any) => ({
        c_id: sc.c_id,
        c_name: sc.c_name,
        c_url: sc.c_url,
        stores: sc.stores ?? []  // <-- ensure it's always an array
      }))
    );
      setMessage(body.message || '');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch store chains');
    }
  };

  // Delete a store chain
  const deleteChain = async (c_id: number) => {
    try {
      const res = await fetch(
        'https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/deleteStoreChain',
        { method: 'POST', body: JSON.stringify({ c_id }) }
      );
      const data = await res.json();
      if (data.statusCode === 200) {
        setMessage('Store chain deleted');
        fetchChains();
      } else {
        setError('Failed to delete store chain');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  // Delete a store
  const deleteStore = async (s_id: number) => {
    try {
      const res = await fetch(
        'https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/deleteStore',
        { method: 'POST', body: JSON.stringify({ s_id }) }
      );
      const data = await res.json();
      if (data.statusCode === 200) {
        setMessage('Store deleted');
        fetchChains();
      } else {
        setError('Failed to delete store');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  useEffect(() => {
    fetchChains();
  }, []);

  return (
    <div>
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      {storeChains.length === 0 ? (
        <p>No store chains found.</p>
      ) : (
        storeChains.map((chain) => (
          <div key={chain.c_id} className="border-b mb-4 pb-2">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{chain.c_name}</h2>
                <a href={chain.c_url} className="text-blue-600 underline">
                  {chain.c_url}
                </a>
              </div>
              <button
                className="text-red-600"
                onClick={() => deleteChain(chain.c_id)}
              >
                Delete Chain
              </button>
            </div>
            <ul className="pl-6 mt-2 list-disc">
              {chain.stores.length > 0 ? (
                chain.stores.map((store) => (
                  <li key={store.s_id} className="flex justify-between items-center">
                    <span>{store.s_address}</span>
                    <button
                      className="text-red-600"
                      onClick={() => deleteStore(store.s_id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p>No stores in this chain</p>
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
