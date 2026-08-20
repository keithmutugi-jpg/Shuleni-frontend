import { useMemo, useState } from 'react';
import { Search, Paperclip, Send } from 'lucide-react';
import { Avatar, Input, Button } from '../components/ui';
import { useAuth } from '../store/AuthContext';
import { listChatRooms, sendMessage } from '../store/db';

function initialsOf(name) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function timeOf(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function RoomListItem({ room, active, onClick }) {
  const last = room.messages[room.messages.length - 1];
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
          {last ? last.text : 'No messages yet'}
        </p>
      </div>
      {last && (
        <span className="text-[11px] shrink-0" style={{ color: active ? 'rgba(255,255,255,0.5)' : 'var(--sh-ink-faint)' }}>
          {timeOf(last.at)}
        </span>
      )}
    </button>
  );
}

function MessageBubble({ msg, mine }) {
  const initials = initialsOf(msg.authorName);
  if (mine) {
    return (
      <div className="flex justify-end gap-3">
        <div className="max-w-lg">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-xs font-semibold">{msg.authorName}</span>
            {msg.authorRole && <span className="text-[11px] capitalize" style={{ color: 'var(--sh-ink-faint)' }}>&middot; {msg.authorRole}</span>}
          </div>
          <div className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white" style={{ background: 'var(--sh-black)' }}>
            {msg.text}
          </div>
          <p className="text-[11px] text-right mt-1" style={{ color: 'var(--sh-ink-faint)' }}>{timeOf(msg.at)}</p>
        </div>
        <Avatar initials={initials} size={32} dark />
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <Avatar initials={initials} size={32} dark={false} />
      <div className="max-w-lg">
        <span className="text-xs font-semibold">{msg.authorName}</span>
        <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm mt-1" style={{ background: '#f1f2f4' }}>
          {msg.text}
        </div>
        <p className="text-[11px] mt-1" style={{ color: 'var(--sh-ink-faint)' }}>{timeOf(msg.at)}</p>
      </div>
    </div>
  );
}

export default function ChatRoom() {
  const { session } = useAuth();
  const [rooms, setRooms] = useState(() => listChatRooms(session.schoolId));
  const [activeRoomId, setActiveRoomId] = useState(rooms[0]?.id);
  const [draft, setDraft] = useState('');

  const room = useMemo(() => rooms.find((r) => r.id === activeRoomId), [rooms, activeRoomId]);

  function handleSend(e) {
    e.preventDefault();
    if (!draft.trim() || !room) return;
    sendMessage(session.schoolId, room.id, {
      authorName: session.name,
      authorRole: session.role,
      text: draft.trim(),
    });
    setRooms(listChatRooms(session.schoolId));
    setDraft('');
  }

  if (rooms.length === 0) {
    return <p className="text-sm" style={{ color: 'var(--sh-ink-faint)' }}>No chat rooms yet.</p>;
  }

  return (
    <div
      className="grid grid-cols-[260px_1fr] rounded-3xl border overflow-hidden"
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
          {rooms.map((r) => (
            <RoomListItem key={r.id} room={r} active={r.id === activeRoomId} onClick={() => setActiveRoomId(r.id)} />
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--sh-border)' }}>
          <div>
            <h2 className="font-bold">{room?.name}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--sh-ink-faint)' }}>
              {room?.messages.length || 0} messages
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" type="button">Files</Button>
            <Button variant="secondary" type="button">Search</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto sh-scrollbar px-6 py-5 space-y-5">
          {room?.messages.length === 0 && (
            <p className="text-sm text-center mt-10" style={{ color: 'var(--sh-ink-faint)' }}>
              No messages yet — say hello.
            </p>
          )}
          {room?.messages.map((m) => (
            <MessageBubble key={m.id} msg={m} mine={m.authorName === session.name} />
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t" style={{ borderColor: 'var(--sh-border)' }}>
          <div
            className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5"
            style={{ borderColor: 'var(--sh-border-strong)' }}
          >
            <Paperclip size={16} style={{ color: 'var(--sh-ink-faint)' }} />
            <Input placeholder="Type a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button
              type="submit"
              aria-label="Send message"
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: draft ? 'var(--sh-black)' : '#eceef1', color: draft ? '#fff' : 'var(--sh-ink-faint)' }}
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
