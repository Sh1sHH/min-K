import React, { useState } from 'react';
import { MessageSquare, Send, User, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'expert';
  status: 'sent' | 'delivered' | 'read';
  timestamp: Date;
}

const AskExpert = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    // Yeni mesajı ekle
    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content: newMessage,
      sender: 'user',
      status: 'sent',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Uzman yanıtını simüle et
    setTimeout(() => {
      const expertMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        content: 'Bu özellik yakında aktif olacak. Şu anda test aşamasındadır.',
        sender: 'expert',
        status: 'delivered',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, expertMessage]);
      setLoading(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-black/50 rounded-xl shadow-lg backdrop-blur-sm border border-white/5">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Bir Bilene Sor</h2>
        </div>
        <p className="mt-2 text-sm text-white/60">
          İK ve bordro konularında uzman danışmanlarımıza sorularınızı iletebilirsiniz.
        </p>
      </div>

      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-2">
            <MessageSquare className="w-12 h-12" />
            <p className="text-sm">Henüz mesaj yok</p>
            <p className="text-xs text-white/30">Uzmanlarımıza soru sormaya başlayın</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[80%]",
                message.sender === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.sender === 'user' ? "bg-blue-500/20" : "bg-purple-500/20"
              )}>
                <User className="w-4 h-4 text-white/70" />
              </div>

              {/* Message */}
              <div className={cn(
                "rounded-xl p-3 relative",
                message.sender === 'user' 
                  ? "bg-blue-500/20 text-white" 
                  : "bg-white/5 text-white/90"
              )}>
                <p className="text-sm">{message.content}</p>
                
                {/* Time and Status */}
                <div className={cn(
                  "flex items-center gap-1 mt-1",
                  message.sender === 'user' ? "justify-end" : ""
                )}>
                  <span className="text-xs text-white/40">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.sender === 'user' && (
                    message.status === 'read' ? (
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    ) : message.status === 'delivered' ? (
                      <CheckCircle2 className="w-3 h-3 text-white/40" />
                    ) : (
                      <Clock className="w-3 h-3 text-white/40" />
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[60px] max-h-[120px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || loading}
            className={cn(
              "px-4 h-[60px] transition-all",
              loading ? "bg-blue-500/50" : "bg-blue-500 hover:bg-blue-600"
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AskExpert; 