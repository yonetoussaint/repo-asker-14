import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Filter, 
  ChevronDown, 
  Heart, 
  MessageCircle,
  Pen,
  Play,
  Send
} from 'lucide-react';

// Mock Button component
const Button = ({ children, variant, className, onClick }) => (
  <button 
    className={`px-4 py-2 rounded border ${variant === 'outline' ? 'border-gray-300 bg-white hover:bg-gray-50' : 'bg-blue-600 text-white hover:bg-blue-700'} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Mock data and utility functions
const mockQAs = [
  {
    id: 1,
    user_name: "John Smith",
    question: "What are the dimensions of this product?",
    answer: "The dimensions are 12\" x 8\" x 4\" (L x W x H). It's compact enough to fit on most desks while providing ample space for your needs.",
    answer_author: "Product Team",
    is_official: true,
    created_at: "2024-08-15T10:30:00Z",
    answered_at: "2024-08-15T14:30:00Z",
    helpful_count: 12,
    reply_count: 4,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', alt: 'Product dimensions' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', alt: 'Product size comparison' }
    ],
    replies: [
      {
        id: 101,
        user_name: "Lisa Wong",
        comment: "Thanks for asking this! I was wondering the same thing.",
        created_at: "2024-08-16T09:15:00Z",
        is_seller: false
      },
      {
        id: 102,
        user_name: "David Kim",
        comment: "Perfect size for my desk setup!",
        created_at: "2024-08-17T14:30:00Z",
        is_seller: false
      },
      {
        id: 103,
        user_name: "Rachel Green",
        comment: "Exactly what I needed to know before purchasing.",
        created_at: "2024-08-18T11:20:00Z",
        is_seller: false
      },
      {
        id: 104,
        user_name: "Mike Johnson",
        comment: "Great question! This helped me decide.",
        created_at: "2024-08-19T16:45:00Z",
        is_seller: false
      }
    ]
  },
  {
    id: 2,
    user_name: "Sarah Johnson",
    question: "Is this product compatible with Mac computers?",
    answer: "Yes, it's fully compatible with Mac computers running macOS 10.14 or later. We also provide dedicated Mac drivers for optimal performance.",
    answer_author: "Tech Support",
    is_official: true,
    created_at: "2024-08-10T14:20:00Z",
    answered_at: "2024-08-10T16:45:00Z",
    helpful_count: 8,
    reply_count: 1,
    media: [
      { type: 'video', url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', alt: 'Mac compatibility demo' }
    ],
    replies: [
      {
        id: 201,
        user_name: "Tech Support",
        comment: "If you need help with Mac setup, our support team is here to help!",
        created_at: "2024-08-11T10:45:00Z",
        is_seller: true
      }
    ]
  },
  {
    id: 3,
    user_name: "Mike Chen",
    question: "How long is the warranty period?",
    answer: "We offer a 2-year limited warranty covering manufacturing defects. Extended warranty options are available at checkout.",
    answer_author: "Customer Service",
    is_official: true,
    created_at: "2024-08-05T09:15:00Z",
    answered_at: "2024-08-05T11:30:00Z",
    helpful_count: 15,
    reply_count: 0,
    media: [],
    replies: []
  },
  {
    id: 4,
    user_name: "Emma Davis",
    question: "What's included in the box?",
    answer: "The box includes: the main unit, power adapter, USB cable, quick start guide, and a premium carrying case.",
    answer_author: "Product Team",
    is_official: true,
    created_at: "2024-08-01T16:45:00Z",
    answered_at: "2024-08-01T17:20:00Z",
    helpful_count: 22,
    reply_count: 1,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', alt: 'Box contents' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', alt: 'Unboxing view' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop', alt: 'All accessories' }
    ],
    replies: [
      {
        id: 401,
        user_name: "Product Team",
        comment: "Everything you need to get started is included!",
        created_at: "2024-08-02T08:20:00Z",
        is_seller: true
      }
    ]
  },
  {
    id: 5,
    user_name: "Tom Wilson",
    question: "Does it work with wireless charging?",
    answer: "This model doesn't support wireless charging, but our Pro version does. You can upgrade during checkout for an additional $29.",
    answer_author: "Product Expert",
    is_official: true,
    created_at: "2024-07-28T11:30:00Z",
    answered_at: "2024-07-28T15:45:00Z",
    helpful_count: 5,
    reply_count: 1,
    media: [],
    replies: [
      {
        id: 501,
        user_name: "Product Expert",
        comment: "Feel free to reach out if you have questions about the Pro version features!",
        created_at: "2024-07-29T13:15:00Z",
        is_seller: true
      }
    ]
  }
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const truncateText = (text, maxLength = 120) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const ProductQA = ({ 
  productId = "123", 
  user = null, 
  questions = mockQAs,
  limit = null 
}) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [questionText, setQuestionText] = useState('');

  const toggleReadMore = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const toggleShowMoreReplies = (questionId) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedReplies(newExpanded);
  };

  const handleSubmitQuestion = () => {
    if (questionText.trim()) {
      // Here you would normally submit the question
      alert(`Question submitted: "${questionText}"`);
      setQuestionText('');
    }
  };

  // Calculate Q&A statistics
  const qaStats = useMemo(() => {
    const count = questions.length;
    const answeredCount = questions.filter(q => q.answer).length;
    const helpfulCount = questions.reduce((sum, q) => sum + q.helpful_count, 0);

    return { count, answeredCount, helpfulCount };
  }, [questions]);

  // Filter and sort questions
  const finalQuestions = useMemo(() => {
    let filtered = [...questions];

    // Apply status filter
    if (filterStatus !== 'all') {
      switch (filterStatus) {
        case 'answered':
          filtered = filtered.filter(q => q.answer);
          break;
        case 'unanswered':
          filtered = filtered.filter(q => !q.answer);
          break;
        case 'official':
          filtered = filtered.filter(q => q.answer && q.is_official);
          break;
      }
    }

    // Sort questions
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'helpful':
          return b.helpful_count - a.helpful_count;
        case 'answered':
          if (a.answer && !b.answer) return -1;
          if (!a.answer && b.answer) return 1;
           return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'unanswered':
          if (!a.answer && b.answer) return -1;
          if (a.answer && !b.answer) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    // Apply limit if specified
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [questions, sortBy, filterStatus, limit]);

  return (
    <div className="space-y-4 pb-20">
      {/* Q&A Summary */}
      <div className="p-4 bg-muted/30 rounded-lg" style={{backgroundColor: 'rgba(0,0,0,0.03)'}}>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{qaStats.count}</div>
            <div className="text-xs text-muted-foreground" style={{color: '#666'}}>Questions</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{qaStats.answeredCount}</div>
            <div className="text-xs text-muted-foreground" style={{color: '#666'}}>Answered</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">{qaStats.count - qaStats.answeredCount}</div>
            <div className="text-xs text-muted-foreground" style={{color: '#666'}}>Pending</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{Math.round(qaStats.count > 0 ? (qaStats.answeredCount / qaStats.count) * 100 : 0)}%</div>
            <div className="text-xs text-muted-foreground" style={{color: '#666'}}>Response Rate</div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-center text-xs text-muted-foreground" style={{color: '#666'}}>
            {qaStats.helpfulCount} helpful votes from the community
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="flex items-center justify-center gap-4">
        {/* Sort Filter */}
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg min-w-0" style={{backgroundColor: 'rgba(0,0,0,0.03)'}}>
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" style={{color: '#666'}} />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer appearance-none min-w-0 flex-1"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="answered">Answered First</option>
            <option value="unanswered">Unanswered First</option>
          </select>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" style={{color: '#666'}} />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg min-w-0" style={{backgroundColor: 'rgba(0,0,0,0.03)'}}>
          <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" style={{color: '#666'}} />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer appearance-none min-w-0 flex-1"
          >
            <option value="all">All Questions</option>
            <option value="answered">Answered Only</option>
            <option value="unanswered">Unanswered Only</option>
            <option value="official">Official Answers</option>
          </select>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" style={{color: '#666'}} />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {finalQuestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground" style={{color: '#666'}}>No questions yet.</p>
            <p className="text-sm text-muted-foreground mt-1" style={{color: '#666'}}>Be the first to ask a question!</p>
          </div>
        ) : (
          finalQuestions.map((qa) => (
            <div key={qa.id} className="border-b pb-4" style={{borderBottom: '1px solid #e5e5e5'}}>
              {/* Question */}
              <div className="flex items-start justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
                    {qa.user_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{qa.user_name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground" style={{color: '#666'}}>
                      {formatDate(qa.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="font-medium text-sm mb-3 px-2">
                {qa.question}
              </div>



              {/* Actions */}
              <div className="flex gap-2 mt-3 px-2">
                <button className="flex items-center gap-2 text-muted-foreground hover:bg-muted transition-colors py-2 px-4 rounded-full bg-muted/50" style={{backgroundColor: 'rgba(0,0,0,0.05)', color: '#666'}}>
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{qa.helpful_count}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:bg-muted transition-colors py-2 px-4 rounded-full bg-muted/50" style={{backgroundColor: 'rgba(0,0,0,0.05)', color: '#666'}}>
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{qa.reply_count}</span>
                </button>
              </div>

              {/* Replies Section */}
              {(qa.answer || (qa.replies && qa.replies.length > 0)) && (
                <div className="mt-4 ml-6 space-y-3">
                  {/* Official Answer - Always shown first if exists */}
                  {qa.answer && (
                    <div className="border-l-2 border-gray-200 pl-4">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                          {qa.answer_author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{qa.answer_author}</span>
                            {qa.is_official && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Official
                              </span>
                            )}
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium">
                              Pinned
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground" style={{color: '#666'}}>
                            {formatDate(qa.answered_at)}
                          </div>
                          <div className="text-sm text-foreground mt-1">
                            {expandedQuestions.has(qa.id) ? qa.answer : truncateText(qa.answer || '')}
                            {(qa.answer || '').length > 120 && (
                              <button
                                onClick={() => toggleReadMore(qa.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-1"
                              >
                                {expandedQuestions.has(qa.id) ? 'Read less' : 'Read more'}
                              </button>
                            )}
                          </div>
                          
                          {/* Media Section for Official Answer */}
                          {qa.media && qa.media.length > 0 && (
                            <div className="mt-3">
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {qa.media.map((item, index) => (
                                  <div key={index} className="flex-shrink-0 relative">
                                    {item.type === 'image' ? (
                                      <img
                                        src={item.url}
                                        alt={item.alt}
                                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => window.open(item.url, '_blank')}
                                      />
                                    ) : item.type === 'video' ? (
                                      <div 
                                        className="w-24 h-24 relative cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden"
                                        onClick={() => window.open(item.url, '_blank')}
                                      >
                                        <img
                                          src={item.thumbnail}
                                          alt={item.alt}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                          <Play className="w-6 h-6 text-white fill-white" />
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Regular Replies */}
                  {qa.replies && qa.replies.length > 0 && (
                    <>
                      {(expandedReplies.has(qa.id) ? qa.replies : qa.replies.slice(0, 2)).map((reply) => (
                        <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-semibold" style={{backgroundColor: reply.is_seller ? '#3b82f6' : 'rgba(0,0,0,0.1)', color: reply.is_seller ? 'white' : 'black'}}>
                              {reply.user_name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{reply.user_name}</span>
                                {reply.is_seller && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Seller
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground" style={{color: '#666'}}>
                                {formatDate(reply.created_at)}
                              </div>
                              <div className="text-sm text-foreground mt-1">
                                {reply.comment}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {qa.replies.length > 2 && (
                        <button
                          onClick={() => toggleShowMoreReplies(qa.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4 transition-colors"
                        >
                          {expandedReplies.has(qa.id) 
                            ? 'Show fewer replies' 
                            : `Show ${qa.replies.length - 2} more replies`
                          }
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {limit && questions.length > limit && (
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => window.location.href = `/product/${productId}/questions`}
        >
          View All {questions.length} Questions
        </Button>
      )}

      {/* Sticky Question Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
            ?
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Ask a question about this product..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
            />
            <button 
              onClick={handleSubmitQuestion}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQA;