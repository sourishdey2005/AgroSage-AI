'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Mic, Send, User } from 'lucide-react';
import { agrobotAssistance } from '@/ai/flows/agrobot-assistance';
import { cn } from '@/lib/utils';

const schema = z.object({
  query: z.string().min(1, 'Query cannot be empty.'),
});
type FormSchema = z.infer<typeof schema>;

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export function AgrobotCard() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setIsLoading(true);
    const userMessage: Message = { sender: 'user', text: data.query };
    setMessages(prev => [...prev, userMessage]);
    reset();

    try {
      const response = await agrobotAssistance({ query: data.query });
      const botMessage: Message = { sender: 'bot', text: response.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = { sender: 'bot', text: 'Sorry, I am having trouble connecting. Please try again later.' };
      setMessages(prev => [...prev, errorMessage]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Bot /> AgroBot Assistant</CardTitle>
        <CardDescription>Your 24/7 AI farming expert. Ask me anything about crops, market prices, or farming techniques.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Bot className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                    <p className="text-muted-foreground">Ask a question to start the conversation.</p>
                    <p className="text-sm text-muted-foreground/80 mt-2">e.g., "What is the best fertilizer for tomatoes?"</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={cn(
                "flex items-start gap-3",
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}>
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                  message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <p className="text-sm">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-0"></span>
                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-150"></span>
                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-300"></span>
                      </div>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full items-center space-x-2">
          <Input id="query" placeholder="Type your question here..." {...register('query')} disabled={isLoading} />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" disabled={isLoading}>
            <Mic className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
