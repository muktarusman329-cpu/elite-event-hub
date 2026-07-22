import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Send, X, Headset } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSocketStore } from '../store/useSocketStore';
import Button from './ui/Button';
import { Textarea } from './ui/Textarea';

function ChatbotWidget() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const on = useSocketStore((s) => s.on);

  useEffect(() => {
    if (!user) return;

    const offReply = on('support_reply', (payload) => {
      setMessages((state) => [
        ...state,
        { id: Date.now() + Math.random(), role: 'admin', text: payload.message, username: payload.adminname || 'Admin' },
      ]);
    });

    return () => {
      offReply();
    };
  }, [on, user]);

  const sendMessage = () => {
    if (!input.trim() || !user) return;

    const message = input.trim();
    const payload = {
      userId: user.id,
      username: user.name,
      message,
      sentAt: new Date().toISOString(),
    };

    useSocketStore.getState().socket?.emit('support_message', payload);
    setMessages((state) => [...state, { id: Date.now() + Math.random(), role: 'user', text: message }]);
    setInput('');
    setOpen(true);
  };

  const canChat = !!user;
  const statusText = canChat ? 'Chat with support' : 'Login to start chat';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[320px] rounded-3xl border border-slate-700/90 bg-slate-950/95 p-4 text-slate-100 shadow-glass backdrop-blur-xl sm:w-[360px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Customer Support</p>
              <p className="text-sm text-slate-400">Live chat with admin in real time.</p>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-700/80 p-2 text-slate-400 transition hover:border-white/20 hover:text-white"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-400">
                Welcome! Send a quick message and our admin will reply here.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-3xl p-3 text-sm ${message.role === 'admin' ? 'bg-slate-800 text-slate-100' : 'bg-emerald-500/15 text-emerald-200 self-end'}`}
                >
                  <p className="font-medium">{message.role === 'admin' ? message.username || 'Admin' : 'You'}</p>
                  <p className="mt-1 leading-6">{message.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 space-y-3">
            <Textarea
              label="Your message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={canChat ? 'Ask a question...' : 'Please log in to chat with admin.'}
              disabled={!canChat}
            />
            <Button type="button" onClick={sendMessage} disabled={!canChat || !input.trim()} className="w-full">
              <Send className="mr-2 h-4 w-4" /> Send message
            </Button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-3 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
        aria-label="Open live support chat"
      >
        <Headset className="h-5 w-5" />
        {statusText}
      </button>
    </div>
  );
}

export default ChatbotWidget;
