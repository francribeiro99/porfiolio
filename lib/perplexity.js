// lib/perplexity.js
export async function searchNews() {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `You are a Portuguese M&A and startup funding news analyst. Find M&A, acquisition, merger, and fundraising news from Portugal from the last 24 hours.

CRITICAL: You must return the ACTUAL article URL, not the homepage.

INCLUDE ONLY:
- Portuguese company acquisitions (any size)
- Foreign companies acquiring Portuguese companies
- Portuguese startup funding rounds (seed to Series Z)
- Banco Português de Fomento or Portugal Ventures fund announcements
- Cross-border M&A deals involving Portuguese entities

EXCLUDE:
- IPOs and stock market listings
- Secondary market trading news
- General business news without transactions
- Non-Portuguese deals

SOURCES TO SEARCH:
- ECO (eco.sapo.pt)
- Observador (observador.pt)
- Dinheiro Vivo (dinheirovivo.pt)
- Jornal de Negócios (jornaldenegocios.pt)
- Aplicações MJ (publicacoes.mj.pt)
- LinkedIn

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "news": [
    {
      "company": "Company Name",
      "type": "acquisition|funding|merger|fund",
      "title": "Brief headline (max 100 chars)",
      "summary": "2-3 sentence summary of the deal",
      "source": "Source name",
      "url": "FULL ARTICLE URL",
      "date": "Date if available"
    }
  ]
}

If no relevant news found, return: {"news": []}`
          },
          {
            role: "user",
            content: "Find Portugal M&A, acquisitions, mergers, and startup funding news from the last 24 hours."
          }
        ],
        temperature: 0.2,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from response
    let parsed;
    try {
      const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/) || 
                       content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse Perplexity response:", e);
      return { news: [] };
    }

    // Validate URLs
    const validatedNews = (parsed.news || []).filter(item => {
      if (!item.url) return false;
      
      // Check if URL is from trusted sources
      const trustedDomains = [
        'eco.sapo.pt',
        'observador.pt',
        'dinheirovivo.pt',
        'jornaldenegocios.pt',
        'publicacoes.mj.pt',
        'linkedin.com'
      ];
      
      try {
        const url = new URL(item.url);
        const isTrusted = trustedDomains.some(domain => url.hostname.includes(domain));
        if (!isTrusted) return false;
        
        // URL should not be just homepage
        if (url.pathname === '/' || url.pathname === '') return false;
        
        return true;
      } catch {
        return false;
      }
    });

    return { news: validatedNews };

  } catch (error) {
    console.error('Error searching news:', error);
    return { news: [] };
  }
}