import { MessageCircle } from 'lucide-react';

function ChatbotWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div className="max-w-xs rounded-3xl bg-slate-950/95 p-5 text-slate-100 shadow-glass backdrop-blur-lg">
        <p className="text-sm text-emerald-300">Live support</p>
        <p className="mt-2 text-sm text-slate-300">
          Need help with booking? Chat with our concierge for instant planning support.
        </p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
          <MessageCircle className="h-4 w-4" /> Chat now
        </button>
      </div>
      <div className="rounded-full border border-emerald-400/20 bg-slate-900/95 p-3 text-emerald-300 shadow-lg">
        <MessageCircle className="h-5 w-5" />
      </div>
    </div>
  );
}

export default ChatbotWidget;
