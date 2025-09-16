import React, { useState, useMemo } from 'react';
import { MessageCircle, Heart, ArrowLeft, Search, Sparkles, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductQA } from '@/hooks/useProductQA';
import { useToast } from '@/hooks/use-toast';
import { useProduct } from '@/hooks/useProduct';
import { Input } from '@/components/ui/input';
import VerificationBadge from '@/components/shared/VerificationBadge';
import QuestionSubmissionDialog from '@/components/product/QuestionSubmissionDialog';
import AskAISheet from '@/components/product/AskAISheet';

const ProductQAPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showAskAISheet, setShowAskAISheet] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: productId } = useParams();
  
  const { data: product } = useProduct(productId || '');
  const { qaItems: allQAItems, seller, isLoading, error, incrementHelpful, incrementQuestionLikes, refetch } = useProductQA(productId || '');

  // Filter Q&A items based on search
  const filteredQAItems = useMemo(() => {
    if (!searchQuery.trim()) return allQAItems;
    return allQAItems.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.answer && item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, allQAItems]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleAskQuestionClick = () => {
    setShowAskAISheet(true);
  };

  const handleLikeQuestion = async (qaId: string) => {
    await incrementQuestionLikes(qaId);
    toast({
      title: "Question liked!",
      description: "Your like has been added to this question.",
    });
  };

  const renderSellerName = (answeredBy: string | null) => {
    if (!answeredBy) return null;
    
    // Check if the answerer is the seller
    const isSeller = seller && answeredBy === seller.name;
    
    return (
      <span className="flex items-center gap-1">
        <span>Answered by {answeredBy}</span>
        {isSeller && seller.verified && (
          <VerificationBadge size="xs" />
        )}
      </span>
    );
  };

  const handleHelpfulAnswer = async (qaId: string) => {
    await incrementHelpful(qaId);
    toast({
      title: "Thanks for your feedback!",
      description: "Your feedback helps other customers.",
    });
  };

  const handleBack = () => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-white border-b px-4 py-3 z-50">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Q&As</h1>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-b pb-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-white border-b px-4 py-3 z-50">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Q&As</h1>
          </div>
        </div>
        <div className="p-4 text-center py-8">
          <p className="text-gray-500">Failed to load Q&As. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-3 z-50">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={handleBack} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Q&As</h1>
            <p className="text-sm text-gray-500">{product?.name}</p>
          </div>
          <div className="flex gap-2">
            <button 
              className="bg-blue-100 hover:bg-blue-200 transition-colors px-3 py-1.5 rounded-full text-blue-600 font-medium text-sm flex items-center gap-1"
              onClick={handleAskQuestionClick}
            >
              <Sparkles className="w-3 h-3" />
              Ask AI
            </button>
            <button 
              className="bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full text-gray-600 font-medium text-sm flex items-center gap-1"
              onClick={() => setShowQuestionDialog(true)}
            >
              <Plus className="w-3 h-3" />
              Ask
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search questions and answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredQAItems.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery ? 'No matching questions found' : 'No questions yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Be the first to ask about this product!'
              }
            </p>
            {!searchQuery && (
              <div className="flex gap-3 justify-center">
                <button 
                  className="bg-blue-100 hover:bg-blue-200 transition-colors px-6 py-3 rounded-full text-blue-600 font-medium flex items-center gap-2"
                  onClick={handleAskQuestionClick}
                >
                  <Sparkles className="w-4 h-4" />
                  Ask AI Assistant
                </button>
                <button 
                  className="bg-orange-500 hover:bg-orange-600 transition-colors px-6 py-3 rounded-full text-white font-medium flex items-center gap-2"
                  onClick={() => setShowQuestionDialog(true)}
                >
                  <Plus className="w-4 h-4" />
                  Ask Question
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQAItems.map((item) => (
              <div key={item.id} className="border-b pb-6 last:border-b-0">
                <div className="space-y-4">
                  {/* Question */}
                  <div>
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-gray-900 flex-1 pr-3 leading-relaxed">
                            {item.question}
                            {!item.answer && (
                              <span className="ml-3 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full font-normal">
                                Awaiting seller response
                              </span>
                            )}
                          </p>
                          <button 
                            onClick={() => handleLikeQuestion(item.id)}
                            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full text-gray-600 flex-shrink-0"
                          >
                            <Heart className="w-3 h-3" />
                            <span className="text-sm font-medium">{item.question_likes}</span>
                          </button>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Asked by {item.asked_by} • {formatDate(item.ask_date)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  {item.answer && (
                    <div className="ml-8 bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-3">
                        {renderSellerName(item.answered_by)} 
                        {item.answer_date && ` • ${formatDate(item.answer_date)}`}
                      </div>
                      <div className="flex items-center justify-start mt-3">
                        <button 
                          onClick={() => handleHelpfulAnswer(item.id)}
                          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-full text-gray-600"
                        >
                          <Heart className="w-3 h-3" />
                          <span className="text-sm font-medium">Helpful ({item.helpful_count})</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <QuestionSubmissionDialog
        isOpen={showQuestionDialog}
        onClose={() => setShowQuestionDialog(false)}
        onSubmit={refetch}
      />

      <AskAISheet
        isOpen={showAskAISheet}
        onClose={() => setShowAskAISheet(false)}
        onQuestionSubmitted={refetch}
      />
    </div>
  );
};

export default ProductQAPage;