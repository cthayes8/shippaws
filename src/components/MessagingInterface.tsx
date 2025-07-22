'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Phone, Video, MoreVertical, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: 'customer' | 'transporter';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  requestId?: string;
  petName?: string;
}

interface MessagingInterfaceProps {
  currentUserId: string;
  currentUserName: string;
}

export default function MessagingInterface({ currentUserId, currentUserName }: MessagingInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participantName: 'Sarah Johnson',
        participantRole: 'customer',
        lastMessage: 'Thank you for accepting my request! When can we schedule the pickup?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        unreadCount: 2,
        requestId: 'req_1',
        petName: 'Max'
      },
      {
        id: '2',
        participantName: 'Mike Wilson',
        participantRole: 'transporter',
        lastMessage: 'I can pick up your pet tomorrow morning. Is 9 AM good for you?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 0,
        requestId: 'req_2',
        petName: 'Luna'
      }
    ];
    setConversations(mockConversations);
  }, []);

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: 'user_2',
      senderName: 'Sarah Johnson',
      content: 'Hi! I saw your bid for transporting Max. Your profile looks great!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      type: 'text'
    },
    {
      id: '2',
      senderId: currentUserId,
      senderName: currentUserName,
      content: 'Thank you! I have 5 years of experience with dog transportation. Max will be in great hands.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      type: 'text'
    },
    {
      id: '3',
      senderId: 'user_2',
      senderName: 'Sarah Johnson',
      content: 'That sounds perfect! I accepted your bid. When can we schedule the pickup?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'text'
    }
  ];

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date() }
          : conv
      )
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 1000 * 60 * 60 * 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Messages</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-500">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(600px-80px)]">
          <div className="p-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conversation.participantAvatar} />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {conversation.participantName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {conversation.participantName}
                        </h4>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            conversation.participantRole === 'customer' 
                              ? 'bg-pink-100 text-pink-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {conversation.participantRole}
                        </Badge>
                        {conversation.petName && (
                          <span className="text-xs text-gray-500">• {conversation.petName}</span>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(conversation.lastMessageTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedConversation.participantAvatar} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {selectedConversation.participantName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedConversation.participantName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.petName && `Transport for ${selectedConversation.petName}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === currentUserId
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === currentUserId
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}