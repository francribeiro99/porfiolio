'use client';
import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testScrapeNews = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/scrape-news', { method: 'POST' });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const testGetNews = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const testSubscribe = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Test Page</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={testScrapeNews} 
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Test Scrape News
        </button>
        
        <button 
          onClick={testGetNews} 
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Test Get News
        </button>
        
        <button 
          onClick={testSubscribe} 
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Test Subscribe
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {result && (
        <div style={{ 
          background: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px',
          overflow: 'auto'
        }}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}