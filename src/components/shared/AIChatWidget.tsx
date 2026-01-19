import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2, Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "What is BuildQuote?",
  "HMO licensing requirements",
  "Trade pricing help",
  "Renters Rights Act 2025",
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm BuildQuote AI. I can help with HMO compliance, trade pricing, property regulations, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Use Lovable AI for chat
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          message: messageText,
          context: "BuildQuote is a UK property compliance and trade pricing platform. Help users with HMO licensing, Renters Rights Act 2025, trade job pricing, EPC requirements, and property regulations.",
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data?.response || "I apologize, but I couldn't process your request. Please try again or use the Contact Form for direct admin support.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback response with helpful info
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateFallbackResponse(messageText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("hmo") || lowerQuery.includes("licensing")) {
      return `**HMO Licensing Requirements (2026) - Landlord Compliance:**
      
• **Mandatory HMO Licence**: Required for 5+ people from 2+ households
• **Minimum Room Sizes**: 6.51m² (1 person), 10.22m² (2 persons)
• **Kitchen**: 7m² for up to 5 people, 10m² for 6-10
• **Bathrooms**: 1 per 5 tenants minimum
• **Additional Licensing**: Many councils now require licences for 3-4 tenant properties
• **Civil Penalties**: Up to £40,000 for non-compliance

Use our Compliance module for detailed property assessments.`;
    }

    if (lowerQuery.includes("renters") || lowerQuery.includes("section 21")) {
      return `**Renters' Rights Act 2025 (Effective May 1, 2026):**

• **Section 21 Abolished**: No-fault evictions banned
• **Assured Periodic Tenancies**: All tenancies become rolling monthly
• **Rent Increases**: Once per year via Section 13 notice (2 months notice)
• **Bidding Wars Banned**: Cannot accept above advertised rent
• **Pets**: Tenants can request pets; landlords must respond within 28 days

Use our Compliance module to check your properties are compliant.`;
    }

    if (lowerQuery.includes("pricing") || lowerQuery.includes("quote") || lowerQuery.includes("trade")) {
      return `**Trade Pricing Help:**

BuildQuote provides accurate UK trade pricing for:
• Plumbing (pipes, fittings, boilers, bathrooms)
• Electrical (wiring, consumer units, lighting)
• Carpentry (doors, skirting, kitchens)
• And more...

Our pricing uses current 2026 UK trade rates with regional adjustments. Use the Trade Jobs module to generate accurate quotes.`;
    }

    if (lowerQuery.includes("epc") || lowerQuery.includes("energy")) {
      return `**EPC Requirements:**

• **Current Minimum**: EPC E for all rentals
• **Proposed**: EPC C by 2028 (new tenancies), 2030 (existing)
• **Exemptions**: Some heritage properties may qualify
• **Funding**: Green Deal loans and grants available

Use our Compliance module to check your EPC status and improvement options.`;
    }

    return `Thank you for your question. BuildQuote helps landlords, developers, and contractors with:

• **HMO Licensing** - Room sizes, kitchen/bathroom ratios, council compliance
• **Landlord Obligations** - Gas safety, electrical, fire safety, HHSRS
• **Trade Pricing** - Accurate UK trade & retail rates with regional adjustments
• **EPC & Compliance** - Energy efficiency requirements, retrofit pathways
• **Property Finance** - BTL, HMO mortgages, development finance, SPVs

Use the specialized modules in the dashboard for detailed guidance.`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 z-50 shadow-2xl transition-all duration-300 ${
      isMinimized ? "w-72 h-14" : "w-[360px] sm:w-[400px] h-[500px]"
    }`}>
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm">BuildQuote AI</CardTitle>
          <Badge variant="secondary" className="text-[10px]">Beta</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <ScrollArea className="h-[360px] p-3" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="p-1.5 rounded-full bg-primary/10 h-7 w-7 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  {message.role === "user" && (
                    <div className="p-1.5 rounded-full bg-muted h-7 w-7 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="p-1.5 rounded-full bg-primary/10 h-7 w-7 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-secondary rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground">Quick questions:</p>
                <div className="flex flex-wrap gap-1">
                  {QUICK_QUESTIONS.map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => sendMessage(q)}
                      disabled={isLoading}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          <CardContent className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about HMO, compliance, pricing..."
                disabled={isLoading}
                className="text-sm"
              />
              <Button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
