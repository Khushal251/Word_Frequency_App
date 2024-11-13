'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [wordFrequencies, setWordFrequencies] = useState<{ word: string; frequency: number }[]>([]);
  const [error, setError] = useState('');

  const fetchWordFrequencies = async () => {
    setError('');
    try {
      const response = await fetch('/api/wordFrequency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (response.ok) {
        setWordFrequencies(data.wordFrequencies);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to fetch word frequencies');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Word Frequency Analyzer</h1>
        
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        
        <button
          onClick={fetchWordFrequencies}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Analyze
        </button>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {wordFrequencies.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-center mb-4">Top 10 Words</h2>
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left font-semibold text-gray-600">Word</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {wordFrequencies.map(({ word, frequency }) => (
                  <tr key={word} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{word}</td>
                    <td className="p-3 text-gray-700">{frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
