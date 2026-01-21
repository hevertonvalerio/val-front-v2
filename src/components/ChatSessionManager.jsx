import { useState } from 'react'
import { Plus, MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react'

function ChatSessionManager({ sessions, activeSessionId, onSelectSession, onNewSession, onDeleteSession, onRenameSession, themeColors }) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const startEditing = (session) => {
    setEditingId(session.id)
    setEditTitle(session.title)
  }

  const saveEdit = (sessionId) => {
    if (editTitle.trim()) {
      onRenameSession(sessionId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  return (
    <div className="flex flex-col p-5 overflow-hidden flex-1">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="font-bold text-gray-800 text-base">Conversas</h3>
        <button
          onClick={onNewSession}
          className={`${themeColors.header} text-white p-2 rounded-lg hover:opacity-90 transition-opacity`}
          title="Nova conversa"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 min-h-0 pr-1">
        {sessions.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">Nenhuma conversa ainda</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                activeSessionId === session.id
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
              onClick={() => editingId !== session.id && onSelectSession(session.id)}
            >
              {editingId === session.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:border-purple-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(session.id)
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); saveEdit(session.id) }}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); cancelEdit() }}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      activeSessionId === session.id ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        activeSessionId === session.id ? 'text-purple-700' : 'text-gray-700'
                      }`}>
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {session.messageCount} mensagens
                      </p>
                    </div>
                  </div>

                  <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEditing(session) }}
                      className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                      title="Renomear"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id) }}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ChatSessionManager
