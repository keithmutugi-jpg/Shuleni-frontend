import { useState, useEffect, useRef } from 'react';
import { Search, Paperclip, Send } from 'lucide-react';
import { Avatar, Input, Button } from '../components/ui';
import { chatRooms, chatParticipants, chatMessages } from '../data/mock';
import { useAuth } from '../context/AuthContext';

function RoomListItem({ room, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-xl flex items-start justify-between gap-2"
      style={{ background: active ? 'var(--sh-black)' : 'transparent' }}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: active ? '#fff' : 'var(--sh-ink)' }}>
          {room.name}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: active ? 'rgba(255,255,255,0.65)' : 'var(--sh-ink-faint)' }}>
          {room.preview}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        {room.unread > 0 && (
          <span
            className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{
              background: active ? '#fff' : 'var(--sh-black)',
              color: active ? 'var(--sh-black)' : '#fff',
            }}
          >
            {room.unread}
          </span>
        )}
        <span className="text-[11px]" style={{ color: active ? 'rgba(255,255,255,0.5)' : 'var(--sh-ink-faint)' }}>
          {room.time}
        </span>
      </div>
    </button>
  );
}

function MessageBubble({ msg }) {
  if (msg.dark) {
    return (
      <div className="flex justify-end gap-3">
        <div className="max-w-lg">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-xs font-semibold">{msg.from}</span>
            {msg.role && <span className="text-[11px]" style={{ color: 'var(--sh-ink-faint)' }}>&middot; {msg.role}</span>}
          </div>
          <div className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white" style={{ background: 'var(--sh-black)' }}>
            {msg.text}
          </div>
          <p className="text-[11px] text-right mt-1" style={{ color: 'var(--sh-ink-faint)' }}>{msg.time}</p>
        </div>
        <Avatar initials={msg.initials} size={32} dark />
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <Avatar initials={msg.initials} size={32} dark={false} />
      <div className="max-w-lg">
        <span className="text-xs font-semibold">{msg.from}</span>
        <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm mt-1" style={{ background: '#f1f2f4' }}>
          {msg.text}
        </div>
        <p className="text-[11px] mt-1" style={{ color: 'var(--sh-ink-faint)' }}>{msg.time}</p>
      </div>
    </div>
  );
}

function ParticipantRow({ p, online }) {
  return (
    <div className="flex items-center gap-3 px-1 py-1.5">
      <Avatar initials={p.initials} size={30} dark={online} online={online} />
      <div className="min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: online ? 'var(--sh-ink)' : 'var(--sh-ink-faint)' }}>{p.name}</p>
        <p className="text-xs" style={{ color: 'var(--sh-ink-faint)' }}>{p.role}</p>
      </div>
    </div>
  );
}

function initialsOf(name) {
  return (name || 'You')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ChatRoom() {
  const { currentUser } = useAuth();
  const [activeRoom, setActiveRoom] = useState(chatRooms[0].id);
  const [draft, setDraft] = useState('');
  const [messagesByRoom, setMessagesByRoom] = useState(() => {
    const map = {};
    chatRooms.forEach((r) => {
      // start each room with the shared mock messages
      map[r.id] = chatMessages.slice();
    });
    return map;
  });
  const room = chatRooms.find((r) => r.id === activeRoom);
  const conversationRef = useRef(null);

  useEffect(() => {
    // load draft for room from localStorage
    const key = `chatDraft:${activeRoom}`;
    const saved = localStorage.getItem(key);
    setDraft(saved || '');
  }, [activeRoom]);

  useEffect(() => {
    // Only attempt a real WebSocket if an explicit flag is set (avoids console errors
    // when there is no backend server). Tests can enable by setting
    // `window.__ENABLE_CHAT_WS = true` before rendering.
    if (typeof window === 'undefined') return undefined;

    if (window.__ENABLE_CHAT_WS && window.WebSocket) {
      let ws;
      try {
        ws = new window.WebSocket(window.__CHAT_WS_URL || 'ws://localhost');
      } catch (e) {
        console.warn('Chat WS init failed', e);
        return undefined;
      }
      ws.addEventListener('error', (err) => console.warn('Chat WS error', err));
      const onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          // payload: { roomId, message }
          if (!payload || !payload.roomId || !payload.message) return;
          setMessagesByRoom((prev) => {
            const copy = { ...prev };
            copy[payload.roomId] = (copy[payload.roomId] || []).concat(payload.message);
            return copy;
          });
        } catch (e) {
          // ignore malformed
        }
      };
      ws.addEventListener('message', onmessage);

      return () => {
        try {
          ws.removeEventListener('message', onmessage);
          ws.close();
        } catch (e) {}
      };
    }

    // No real WS available: start a lightweight simulator so the UI isn't completely static.
    const simInterval = setInterval(() => {
      const now = new Date();
      const time = now.toTimeString().slice(0, 5);
      const msg = { id: Date.now(), from: 'Bot', initials: 'BT', dark: false, time, text: 'This is a local simulated message.' };
      setMessagesByRoom((prev) => {
        const copy = { ...prev };
        // append to current active room for visibility during development
        copy[activeRoom] = (copy[activeRoom] || []).concat(msg);
        return copy;
      });
    }, 20000);

    return () => clearInterval(simInterval);
  }, [activeRoom]);

  useEffect(() => {
    // scroll to bottom when messages change
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [activeRoom, messagesByRoom]);

  function handleSendMessage() {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const msg = {
      id: Date.now(),
      from: currentUser?.name || 'You',
      role: currentUser?.role,
      initials: initialsOf(currentUser?.name),
      dark: true,
      time,
      text,
    };
    setMessagesByRoom((prev) => {
      const copy = { ...prev };
      copy[activeRoom] = (copy[activeRoom] || []).concat(msg);
      return copy;
    });
    try {
      localStorage.removeItem(`chatDraft:${activeRoom}`);
    } catch (e) {}
    setDraft('');
  }

  return (
    <div
      className="grid grid-cols-[260px_1fr_260px] rounded-3xl border overflow-hidden"
      style={{ background: 'var(--sh-surface)', borderColor: 'var(--sh-border)', height: 'calc(100vh - 220px)', minHeight: 520 }}
    >
      {/* Rooms */}
      <div className="border-r flex flex-col" style={{ borderColor: 'var(--sh-border)' }}>
        <div className="p-4 pb-2">
          <p className="sh-label mb-3">Chat Rooms</p>
          <div className="flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: 'var(--sh-border-strong)' }}>
            <Search size={14} style={{ color: 'var(--sh-ink-faint)' }} />
            <Input placeholder="Search rooms…" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto sh-scrollbar px-2 pb-3 space-y-1">
          {chatRooms.map((r) => (
            <RoomListItem key={r.id} room={r} active={r.id === activeRoom} onClick={() => setActiveRoom(r.id)} />
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--sh-border)' }}>
          <div>
            <h2 className="font-bold">{room?.name}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--sh-ink-faint)' }}>
              {chatParticipants.online.length + chatParticipants.away.length} participants &middot; {chatParticipants.online.length} online
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">Files</Button>
            <Button variant="secondary">Search</Button>
          </div>
        </div>

        <div ref={conversationRef} className="flex-1 overflow-y-auto sh-scrollbar px-6 py-5 space-y-5">
          {(messagesByRoom[activeRoom] || []).map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'var(--sh-border)' }}>
          <div
            className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5"
            style={{ borderColor: 'var(--sh-border-strong)' }}
          >
            <Paperclip size={16} style={{ color: 'var(--sh-ink-faint)' }} />
            <Input
              placeholder="Type a message…"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                try {
                  localStorage.setItem(`chatDraft:${activeRoom}`, e.target.value);
                } catch (e) {
                  // ignore storage errors
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && draft.trim()) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              type="button"
              aria-label="Send message"
              onClick={() => { if (draft.trim()) handleSendMessage(); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: draft ? 'var(--sh-black)' : '#eceef1', color: draft ? '#fff' : 'var(--sh-ink-faint)' }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="border-l p-4 overflow-y-auto sh-scrollbar" style={{ borderColor: 'var(--sh-border)' }}>
        <p className="sh-label mb-3">Participants</p>
        <p className="text-xs mb-3" style={{ color: 'var(--sh-ink-faint)' }}>
          {chatParticipants.online.length + chatParticipants.away.length} total &middot; {chatParticipants.online.length} online
        </p>

        <p className="text-[11px] font-semibold mb-1" style={{ color: 'var(--sh-ink-faint)' }}>ONLINE</p>
        {chatParticipants.online.map((p) => (
          <ParticipantRow key={p.initials + p.name} p={p} online />
        ))}

        <p className="text-[11px] font-semibold mb-1 mt-4" style={{ color: 'var(--sh-ink-faint)' }}>AWAY</p>
        {chatParticipants.away.map((p) => (
          <ParticipantRow key={p.initials + p.name} p={p} online={false} />
        ))}
      </div>
    </div>
  );
}
