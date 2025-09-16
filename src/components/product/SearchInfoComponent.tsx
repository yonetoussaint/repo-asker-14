import React, { useState } from 'react';
import { useProduct } from '@/hooks/useProduct';
import SearchInfoHeader from '@/components/shared/SearchInfoHeader';

interface SearchInfoComponentProps {
  productId: string;
}

export default function SearchInfoComponent({ productId }: SearchInfoComponentProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: product } = useProduct(productId);

  const handleSubmit = async (questionText: string) => {
    if (!questionText.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    
    try {
      // Create context about the product for the AI
      let productContext = '';
      if (product) {
        productContext = `Product Information:
- Name: ${product.name}
- Price: $${product.price}${product.discount_price ? ` (was $${product.discount_price})` : ''}
- Description: ${product.description || 'No description available'}
- Category: ${product.category || 'No category specified'}
- Rating: ${product.rating || 'No rating'}/5
- Stock: ${product.inventory || 'Stock info not available'}
${product.specifications ? `- Specifications: ${JSON.stringify(product.specifications)}` : ''}

User Question: ${questionText}

Please answer the user's question specifically about this product based on the information provided. If the information needed to answer the question is not available in the product details, please say so clearly.`;
      } else {
        productContext = `The user is asking: ${questionText}
        
Note: Product information is not currently available. Please let the user know that product details are loading and ask them to try again in a moment.`;
      }

      const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3.1:free",
          messages: [
            {
              role: "user",
              content: productContext
            }
          ]
        })
      });

      if (!apiResponse.ok) {
        throw new Error(`API request failed: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      const answer = data.choices[0]?.message?.content || 'No response received';
      setResponse(answer);
    } catch (error) {
      console.error('Error calling API:', error);
      setResponse('Sorry, there was an error getting an answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSubmit(suggestion);
  };

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <SearchInfoHeader />

      {/* Search Input */}
      <div className="mb-4">
        <form onSubmit={handleInputSubmit} className="relative">
          <input
            type="text"
            placeholder="Ask Rufus or search reviews and Q&A"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2.5 pr-12 text-gray-600 bg-white border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 rounded-full p-1.5 transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            )}
          </button>
        </form>
      </div>

      {/* Response Area */}
      {response && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="text-sm text-gray-800 whitespace-pre-wrap">{response}</div>
        </div>
      )}

      {/* Suggestion Pills - Horizontally Scrollable */}
      <div className="-mx-4">
        <div className="overflow-x-auto scrollbar-hide px-4">
          <div className="flex gap-2 pb-2">
            <button 
              onClick={() => handleSuggestionClick('Does it have facial recognition?')}
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 text-blue-800 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
            >
              Does it have facial recognition?
            </button>
            <button 
              onClick={() => handleSuggestionClick('Is this phone waterproof?')}
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 text-blue-800 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
            >
              Is this phone waterproof?
            </button>
            <button 
              onClick={() => handleSuggestionClick('What is the battery life like?')}
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 text-blue-800 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
            >
              What is the battery life like?
            </button>
            <button 
              onClick={() => handleSuggestionClick('How good is the camera quality?')}
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 text-blue-800 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
            >
              How good is the camera quality?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}