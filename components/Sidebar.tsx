
import React from 'react';
import { Note } from '../types';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
  searchQuery,
  setSearchQuery
}) => {
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="w-full md:w-80 h-full flex flex-col bg-white border-r border-slate-200">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">L</span>
            Lumina
          </h1>
          <button
            onClick={onNewNote}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
            title="New Note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-sm transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-slate-400 text-sm italic">No notes found</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <button
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`w-full text-left p-4 mb-2 rounded-xl transition-all group relative ${
                activeNoteId === note.id 
                  ? 'bg-indigo-50 border-indigo-100' 
                  : 'hover:bg-slate-50 border-transparent'
              } border`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold truncate pr-6 ${activeNoteId === note.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {note.title || 'Untitled Note'}
                </h3>
                <button 
                  onClick={(e) => onDeleteNote(note.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all absolute top-3 right-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {note.content || 'No additional content...'}
              </p>
              <div className="mt-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
