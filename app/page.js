'use client';
import { useState, useEffect } from 'react';
import { Search, ExternalLink, TrendingUp, Building2, DollarSign, Briefcase } from 'lucide-react';

export default function HomePage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSidebar, setShowSearchSidebar] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  const mockNews = [
    {
      id: 1,
      company: "Talkdesk",
      type: "funding",
      title: "Talkdesk raises €45M in Series E extension",
      summary: "Portuguese unicorn Talkdesk secured an additional €45 million in its Series E round, led by existing investor Viking Global Investors.",
      source: "ECO",
      url: "https://eco.sapo.pt",
      article_date: new Date(),
      created_at: new Date()
    },
    {
      id: 2,
      company: "Feedzai",
      type: "acquisition",
      title: "Feedzai acquires UK-based fraud detection startup",
      summary: "Lisbon-based Feedzai announced the acquisition of London's FraudGuard for an undisclosed amount.",
      source: "Observador",
      url: "https://observador.pt",
      article_date: new Date(),
      created_at: new Date()
    },
    {
      id: 3,
      company: "Outsystems",
      type: "merger",
      title: "Outsystems and Microsoft deepen strategic partnership",
      summary: "Portuguese low-code leader Outsystems announced a strategic merger with Microsoft's PowerApps division.",
      source: "Dinheiro Vivo",
      url: "https://www.dinheirovivo.pt",
      article_date: new Date(Date.now() - 86400000),
      created_at: new Date(Date.now() - 86400000)
    }
  ];

  useEffect(() => {
    setNews(mockNews);
    setLoading(false);
  }, []);

  const formatDate = (date) => {
    const newsDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - newsDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    
    return newsDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeConfig = (type) => {
    const configs = {
      funding: {
        label: 'Funding',
        icon: TrendingUp,
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-200'
      },
      acquisition: {
        label: 'Acquisition',
        icon: Building2,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200'
      },
      merger: {
        label: 'Merger',
        icon: Briefcase,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-200'
      },
      fund: {
        label: 'Fund',
        icon: DollarSign,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200'
      }
    };
    return configs[type] || configs.funding;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowSearchSidebar(true);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeStatus('loading');
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus(''), 3000);
    }, 1000);
  };

  const groupedNews = news.reduce((groups, item) => {
    const date = formatDate(item.article_date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <p className="text-sm text-blue-900 text-center max-w-5xl mx-auto">
          ℹ️ This platform uses advanced AI to aggregate news from trusted sources. While we employ rigorous verification methods, we recommend verifying critical information with the original source before making business decisions.
        </p>
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="75" r="12" fill="#006747"/>
                  <circle cx="30" cy="35" r="15" fill="#006747"/>
                  <circle cx="70" cy="35" r="15" fill="#006747"/>
                  <circle cx="50" cy="25" r="15" fill="#006747"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  PORFIOLIO
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  Portugal M&A and Fundraising News
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search company..."
                  className="w-80 px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${showSearchSidebar ? 'mr-96' : ''}`}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-gray-600">Loading news...</p>
              </div>
            ) : (
              <>
                {Object.entries(groupedNews).map(([date, items]) => (
                  <div key={date} className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <h2 className="text-lg font-semibold text-gray-700 px-4">
                        {date}
                      </h2>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="space-y-4">
                      {items.map((item) => {
                        const typeConfig = getTypeConfig(item.type);
                        const Icon = typeConfig.icon;

                        return (
                          <article
                            key={item.id}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${typeConfig.bgColor} ${typeConfig.textColor} border ${typeConfig.borderColor}`}>
                                  <Icon className="w-4 h-4" />
                                  {typeConfig.label}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {item.company}
                                </span>
                              </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                              {item.title}
                            </h3>

                            <p className="text-gray-700 leading-relaxed mb-4">
                              {item.summary}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <span className="text-sm text-gray-500">
                                Source: <span className="font-medium">{item.source}</span>
                              </span>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
                              >
                                Read full article
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200 p-8 mt-12">
                  <div className="max-w-2xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Never Miss a Deal
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Get daily M&A and fundraising news delivered to your inbox
                    </p>
                    
                    <div className="flex gap-3 max-w-md mx-auto">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                      <button
                        onClick={handleSubscribe}
                        disabled={subscribeStatus === 'loading'}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400 transition-colors"
                      >
                        {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                      </button>
                    </div>

                    {subscribeStatus === 'success' && (
                      <p className="mt-4 text-emerald-700 font-medium">
                        ✓ Successfully subscribed! Check your inbox.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        {showSearchSidebar && (
          <aside className="fixed right-0 top-[129px] bottom-0 w-96 bg-white border-l border-gray-200 shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Search Results
                </h3>
                <button
                  onClick={() => setShowSearchSidebar(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Search Coming Soon
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Company search will be available in the next update.
                </p>
                <p className="text-xs text-gray-500">
                  Searched for: <span className="font-medium">{searchQuery}</span>
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}