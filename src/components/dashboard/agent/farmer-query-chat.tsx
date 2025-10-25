'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, MessageSquare, Wheat, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Farmer = {
  id: string;
  name: string;
  avatar: string;
  fallback: string;
};

type Query = {
  id: string;
  farmerId: string;
  subject: string;
  topic: 'disease' | 'market';
  messages: {
    sender: 'farmer' | 'agent';
    text: string;
    timestamp: string;
  }[];
  isRead: boolean;
};

const farmers: Farmer[] = [
  { id: 'f1', name: 'Ramesh Kumar', avatar: 'https://i.pravatar.cc/150?u=ramesh', fallback: 'RK' },
  { id: 'f2', name: 'Sita Devi', avatar: 'https://i.pravatar.cc/150?u=sita', fallback: 'SD' },
  { id: 'f3', name: 'Vijay Singh', avatar: 'https://i.pravatar.cc/150?u=vijay', fallback: 'VS' },
];

const mockQueries: Query[] = [
  {
    id: 'q1',
    farmerId: 'f1',
    subject: 'Tomato leaf curl issue',
    topic: 'disease',
    isRead: false,
    messages: [
      { sender: 'farmer', text: 'My tomato plants have yellow, curled leaves. What should I do?', timestamp: '10:30 AM' },
    ],
  },
  {
    id: 'q2',
    farmerId: 'f2',
    subject: 'Best price for wheat?',
    topic: 'market',
    isRead: true,
    messages: [
      { sender: 'farmer', text: 'What is the current forecast for wheat prices in Lucknow mandi?', timestamp: 'Yesterday' },
      { sender: 'agent', text: 'Hi Sita, prices are expected to rise by 5-7% over the next week. Holding for a few more days could be profitable.', timestamp: 'Yesterday' },
       { sender: 'farmer', text: 'Thank you for the advice!', timestamp: '9:00 AM' },
    ],
  },
  {
    id: 'q3',
    farmerId: 'f3',
    subject: 'Potato blight signs',
    topic: 'disease',
    isRead: true,
    messages: [
        { sender: 'farmer', text: 'I see some dark spots on my potato leaves. Is this blight?', timestamp: '2 days ago' },
    ],
  },
];

export function FarmerQueryChatPanel() {
  const [queries, setQueries] = React.useState(mockQueries);
  const [selectedQuery, setSelectedQuery] = React.useState<Query>(queries[0]);
  const [replyText, setReplyText] = React.useState('');

  const handleSelectQuery = (query: Query) => {
    setSelectedQuery(query);
    setQueries(queries.map(q => q.id === query.id ? { ...q, isRead: true } : q));
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    const newAgentMessage = {
        sender: 'agent' as const,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedQueries = queries.map(q => {
        if (q.id === selectedQuery.id) {
            return {
                ...q,
                messages: [...q.messages, newAgentMessage]
            };
        }
        return q;
    });

    setQueries(updatedQueries);
    setSelectedQuery(updatedQueries.find(q => q.id === selectedQuery.id)!);
    setReplyText('');
  };


  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <MessageSquare /> Farmer Query Panel
        </CardTitle>
        <CardDescription>Respond to direct queries from your farmer network.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 flex-grow overflow-hidden">
        {/* Query List */}
        <div className="col-span-1 border-r pr-4">
          <h4 className="text-sm font-semibold mb-2">Inbox</h4>
          <ScrollArea className="h-[calc(100%-20px)]">
            <div className="space-y-2">
              {queries.map((query) => {
                const farmer = farmers.find(f => f.id === query.farmerId);
                return (
                  <button
                    key={query.id}
                    onClick={() => handleSelectQuery(query)}
                    className={cn(
                      'w-full text-left p-2 rounded-md transition-colors',
                      selectedQuery.id === query.id ? 'bg-muted' : 'hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={farmer?.avatar} alt={farmer?.name} />
                                <AvatarFallback>{farmer?.fallback}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold text-sm truncate">{farmer?.name}</p>
                        </div>
                         {!query.isRead && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">{query.subject}</p>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="col-span-2 flex flex-col h-full">
            {selectedQuery ? (
                <>
                    <div className="flex-grow overflow-hidden">
                         <ScrollArea className="h-full pr-2">
                             <div className="space-y-4">
                                {selectedQuery.messages.map((message, index) => (
                                    <div key={index} className={cn("flex items-end gap-2", message.sender === 'agent' ? 'justify-end' : 'justify-start')}>
                                        {message.sender === 'farmer' && (
                                             <Avatar className="h-8 w-8">
                                                <AvatarImage src={farmers.find(f=>f.id === selectedQuery.farmerId)?.avatar} />
                                                <AvatarFallback>{farmers.find(f=>f.id === selectedQuery.farmerId)?.fallback}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "max-w-xs p-3 rounded-lg text-sm",
                                            message.sender === 'agent' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                        )}>
                                            <p>{message.text}</p>
                                            <p className="text-xs opacity-70 mt-1 text-right">{message.timestamp}</p>
                                        </div>
                                         {message.sender === 'agent' && (
                                             <Avatar className="h-8 w-8">
                                                <AvatarFallback>A</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                             </div>
                         </ScrollArea>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <Textarea
                          placeholder="Type your reply..."
                          className="flex-grow"
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendReply();
                            }
                          }}
                        />
                        <Button size="icon" onClick={handleSendReply}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>Select a query to view the conversation.</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

    