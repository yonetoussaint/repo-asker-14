import React, { useState } from 'react';
import { ChevronDown, User, Bot, Send, Sparkles, HelpCircle, ArrowUp, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface AskAISheetProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionSubmitted?: () => void;
}

const AskAISheet: React.FC<AskAISheetProps> = ({
  isOpen,
  onClose,
  onQuestionSubmitted,
}) => {
  const { toast } = useToast();
  const { id: productId } = useParams();
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmitQuestion = async (finalQuestion: string) => {
    if (!finalQuestion.trim() || !productId) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('questions_answers')
        .insert({
          product_id: productId,
          question: finalQuestion.trim(),
          asked_by: 'Anonymous User',
        });

      if (error) throw error;

      toast({
        title: "Question submitted!",
        description: "Your question has been submitted successfully. You'll be notified when the seller responds.",
      });

      // Reset and close
      setMessages([]);
      setInputMessage('');
      onQuestionSubmitted?.();
      onClose();
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAIResponse = (question) => {
    const responses = [
      "That's a great question! Based on the product details, here are some optimized ways to ask:\n\n• **Compatibility question**: \"Is this product compatible with [specific device/model]?\"\n• **Technical specs**: \"What are the exact dimensions and technical specifications?\"\n• **Usage scenarios**: \"How well does this work for [your specific use case]?\"\n\nWould you like me to help you refine your question further?",

      "I can help you structure that question better! Here are some suggestions:\n\n• Be more specific about your requirements\n• Include your device model or setup\n• Mention your intended use case\n• Ask about potential limitations\n\nFor example, instead of asking generally, you could ask: \"Does this work reliably with [your specific setup] for [your intended use]?\"",

      "Great question! Let me suggest some refined versions:\n\n• **For compatibility**: \"Is this fully compatible with [specific model/version]?\"\n• **For performance**: \"What's the real-world performance like for [specific task]?\"\n• **For durability**: \"How does this hold up with regular use over time?\"\n\nThese focused questions typically get better, more detailed answers from sellers and other customers."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickSubmit = (question: string) => {
    handleSubmitQuestion(question);
  };

  const handleSheetClose = () => {
    setMessages([]);
    setInputMessage('');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetClose}>
      <SheetContent 
        side="bottom" 
        className="h-[75vh] rounded-t-3xl border-0 p-0 overflow-hidden"
      >
        <div className="flex flex-col h-full bg-white">
          {/* Drag Handle */}
          <div className="flex justify-center py-3 bg-white">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Chat Messages - Account for drag handle and input area */}
          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center min-h-[400px]">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ask Question Assistant</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Describe what you want to know about this product, and I'll help you craft the perfect question.
                </p>
                <div className="grid grid-cols-1 gap-3 w-full max-w-lg">
                  <button 
                    onClick={() => handleQuickSubmit("Is this product compatible with my device?")}
                    className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    <div className="font-medium text-gray-900 mb-1">Check compatibility</div>
                    <div className="text-sm text-gray-600">Ask about device or system compatibility</div>
                  </button>
                  <button 
                    onClick={() => handleQuickSubmit("What's the performance like for daily use?")}
                    className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    <div className="font-medium text-gray-900 mb-1">Performance questions</div>
                    <div className="text-sm text-gray-600">Ask about speed, battery, or efficiency</div>
                  </button>
                  <button 
                    onClick={() => handleQuickSubmit("How durable is this product with regular use?")}
                    className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    <div className="font-medium text-gray-900 mb-1">Durability & quality</div>
                    <div className="text-sm text-gray-600">Ask about build quality and longevity</div>
                  </button>
                  <button 
                    onClick={() => handleQuickSubmit("What exactly is included in the package?")}
                    className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    <div className="font-medium text-gray-900 mb-1">What's included</div>
                    <div className="text-sm text-gray-600">Ask about package contents and accessories</div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs ${message.type === 'user' ? 'order-1' : 'order-1'}`}>
                      <div className={`max-w-none ${
                        message.type === 'user' 
                          ? 'bg-gray-100 text-gray-900 rounded-xl p-3 ml-auto' 
                          : 'text-gray-900'
                      }`}>
                         {message.type === 'assistant' ? (
                          <div>
                            <div dangerouslySetInnerHTML={{
                              __html: message.content
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/• (.*?)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-orange-500 mt-0.5">•</span><span>$1</span></div>')
                                .replace(/\n\n/g, '<div class="my-3"></div>')
                                .replace(/\n/g, '<br>')
                            }} />
                            <div className="mt-4 pt-3 border-t border-gray-200">
                              <button
                                onClick={() => handleSubmitQuestion(inputMessage)}
                                disabled={isSubmitting || !inputMessage.trim()}
                                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                {isSubmitting ? 'Submitting...' : 'Submit This Question'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span>{message.content}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs">
                      <div className="text-gray-600">
                        <div className="flex items-center gap-1">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm ml-2">Analyzing your question...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about this product..."
                className="w-full py-3 px-4 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || isSubmitting}
                className="absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-orange-500 rounded-full flex items-center justify-center transition-colors"
              >
                {inputMessage.trim() ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AskAISheet;