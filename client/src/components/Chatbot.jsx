import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  User,
  Sparkles,
  Loader2,
  RotateCcw
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Chatbot = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Store separate chat histories for each user, course, and general chat
  const [chatHistories, setChatHistories] = useState(() => {
    // Load from localStorage if available (user-specific)
    if (!user) return {};
    
    try {
      const storageKey = `mentora_chat_histories_${user._id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        Object.keys(parsed).forEach(key => {
          parsed[key] = parsed[key].map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
        return parsed;
      }
    } catch (error) {
      console.error("Error loading chat histories:", error);
    }
    
    // Default initial state
    return {
      general: [
        {
          id: 1,
          text: `Hi${user?.name ? ` ${user.name}` : ''}! 👋 I'm your Mentora AI assistant. How can I help you today?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ],
    };
  });

  // Save chat histories to localStorage whenever they change (user-specific)
  useEffect(() => {
    if (!user) return;
    
    try {
      const storageKey = `mentora_chat_histories_${user._id}`;
      localStorage.setItem(storageKey, JSON.stringify(chatHistories));
    } catch (error) {
      console.error("Error saving chat histories:", error);
    }
  }, [chatHistories, user]);

  // Reset chat histories when user changes (login/logout)
  useEffect(() => {
    if (!user) {
      setChatHistories({});
      return;
    }

    // Load user-specific chat histories
    try {
      const storageKey = `mentora_chat_histories_${user._id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(key => {
          parsed[key] = parsed[key].map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
        setChatHistories(parsed);
      } else {
        // Initialize with welcome message
        setChatHistories({
          general: [
            {
              id: 1,
              text: `Hi ${user.name}! 👋 I'm your Mentora AI assistant. How can I help you today?`,
              sender: "bot",
              timestamp: new Date(),
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error loading user chat histories:", error);
    }
  }, [user?._id]); // Only re-run when user ID changes

  // Get current messages based on context (course or general)
  const chatKey = currentCourseId || 'general';
  const messages = chatHistories[chatKey] || [
    {
      id: 1,
      text: `Hi${user?.name ? ` ${user.name}` : ''}! 👋 I'm your Mentora AI assistant. ${currentCourseId ? "How can I help you with this course?" : "How can I help you today?"}`,
      sender: "bot",
      timestamp: new Date(),
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Detect if user is on a course page and initialize chat if needed
  useEffect(() => {
    const pathMatch = location.pathname.match(/\/courses\/([a-f0-9]+)/);
    const newCourseId = pathMatch ? pathMatch[1] : null;
    
    if (newCourseId !== currentCourseId) {
      setCurrentCourseId(newCourseId);
      
      // Initialize chat history for this course if it doesn't exist
      if (newCourseId && !chatHistories[newCourseId] && user) {
        setChatHistories(prev => ({
          ...prev,
          [newCourseId]: [
            {
              id: 1,
              text: `Hi ${user.name}! 👋 I'm here to help you with this course. What would you like to know?`,
              sender: "bot",
              timestamp: new Date(),
            },
          ],
        }));
      }
      
      // Initialize general chat if it doesn't exist
      if (!newCourseId && !chatHistories.general && user) {
        setChatHistories(prev => ({
          ...prev,
          general: [
            {
              id: 1,
              text: `Hi ${user.name}! 👋 I'm your Mentora AI assistant. How can I help you today?`,
              sender: "bot",
              timestamp: new Date(),
            },
          ],
        }));
      }
    }
  }, [location, currentCourseId, user, chatHistories]);



  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const currentChatKey = chatKey;
    const currentMessages = chatHistories[currentChatKey] || [];

    const userMessage = {
      id: currentMessages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    // Update the specific chat history
    setChatHistories(prev => ({
      ...prev,
      [currentChatKey]: [...(prev[currentChatKey] || []), userMessage]
    }));

    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      console.log("🤖 Sending message to AI...", { courseId: currentCourseId, chatKey: currentChatKey });

      const response = await api.post("/chatbot/chat", {
        message: currentInput,
        courseId: currentCourseId,
        conversationHistory: currentMessages.slice(-10)
      });

      const aiText = (response.data.message || "I'm sorry, I couldn't generate a response.").trim();

      const botMessage = {
        id: currentMessages.length + 2,
        text: aiText,
        sender: "bot",
        timestamp: new Date(),
      };

      // Update the specific chat history with bot response
      setChatHistories(prev => ({
        ...prev,
        [currentChatKey]: [...(prev[currentChatKey] || []), botMessage]
      }));
    } catch (error) {
      console.error("❌ Chat error:", error);
      
      const errorMessage = {
        id: currentMessages.length + 2,
        text: error.response?.data?.message || "I'm having trouble connecting. Please try again in a moment. 🙏",
        sender: "bot",
        timestamp: new Date(),
      };
      
      // Update the specific chat history with error message
      setChatHistories(prev => ({
        ...prev,
        [currentChatKey]: [...(prev[currentChatKey] || []), errorMessage]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format message with markdown-like styling
  const formatMessage = (text) => {
    // Split by lines
    const lines = text.split('\n');
    const elements = [];
    let listItems = [];
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Empty line
      if (!trimmedLine) {
        if (inList && listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="my-2 ml-4 space-y-1">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        elements.push(<br key={`br-${index}`} />);
        return;
      }

      // Bullet points (•, -, *, or numbered)
      const bulletMatch = trimmedLine.match(/^[•\-*]\s+(.+)/) || trimmedLine.match(/^\d+\.\s+(.+)/);
      if (bulletMatch) {
        inList = true;
        listItems.push(bulletMatch[1]);
        return;
      }

      // If we were in a list, render it
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="my-2 ml-3 space-y-1.5 list-disc list-inside">
            {listItems.map((item, i) => (
              <li key={i} className="text-gray-700 text-sm marker:text-blue-500">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }

      // Check for headings
      if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h4 key={`h4-${index}`} className="font-semibold text-gray-800 mt-3 mb-1">
            {trimmedLine.substring(4)}
          </h4>
        );
        return;
      }
      if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h3 key={`h3-${index}`} className="font-bold text-gray-900 mt-3 mb-1 text-base">
            {trimmedLine.substring(3)}
          </h3>
        );
        return;
      }

      // Bold text (**text** or __text__)
      let formattedLine = trimmedLine;
      formattedLine = formattedLine.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
      formattedLine = formattedLine.replace(/__(.+?)__/g, '<strong class="font-semibold text-gray-900">$1</strong>');
      
      // Italic text (*text* or _text_) - but not if it's part of bold
      formattedLine = formattedLine.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic">$1</em>');
      formattedLine = formattedLine.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em class="italic">$1</em>');
      
      // Code blocks (`code`)
      formattedLine = formattedLine.replace(/`(.+?)`/g, '<code class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

      // Links [text](url)
      formattedLine = formattedLine.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-medium">$1</a>');

      elements.push(
        <p key={`p-${index}`} className="my-1 text-gray-700" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });

    // Render any remaining list items
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key="list-final" className="my-2 ml-3 space-y-1.5 list-disc list-inside">
          {listItems.map((item, i) => (
            <li key={i} className="text-gray-700 text-sm marker:text-blue-500">{item}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };



  // Don't render chatbot if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-105"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? "h-16" : "h-[600px]"
          } flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-blue-600 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">
                  AI Assistant
                  {user?.name && <span className="text-white/60 text-xs ml-1">• {user.name}</span>}
                </h3>
                <span className="text-white/80 text-xs">
                  {currentCourseId ? "Course Chat" : "General Chat"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  if (window.confirm('Clear this chat history?')) {
                    const welcomeMsg = {
                      id: 1,
                      text: `Hi${user?.name ? ` ${user.name}` : ''}! 👋 ${currentCourseId ? "I'm here to help you with this course." : "I'm your Mentora AI assistant."} How can I help you today?`,
                      sender: "bot",
                      timestamp: new Date(),
                    };
                    setChatHistories(prev => ({
                      ...prev,
                      [chatKey]: [welcomeMsg]
                    }));
                  }
                }}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                aria-label="Clear chat"
                title="Clear chat history"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "user"
                            ? "bg-blue-600"
                            : "bg-blue-500"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-800 shadow-sm border border-gray-200"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <p className="text-sm whitespace-pre-line">{message.text}</p>
                          ) : (
                            <div className="text-sm leading-relaxed">
                              {formatMessage(message.text)}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-200">
                        <div className="flex space-x-1.5">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>



              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    {isTyping ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
