
import React, { useState, useEffect, useCallback } from 'react';
import { Note } from './types';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load notes from local storage
  useEffect(() => {
    const savedNotes = localStorage.getItem('lumina_notes');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        setNotes(parsed);
        if (parsed.length > 0) {
          setActiveNoteId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse notes", e);
      }
    } else {
      // Create initial welcome note
      const welcomeNote: Note = {
        id: '1',
        title: 'Welcome to Lumina Notes ✨',
        content: 'Welcome to your new AI-enhanced writing space.\n\nHere you can:\n- Write freely in this clean workspace\n- Use the sidebar to search and switch notes\n- Click the "AI Tools" button at the top right to enhance your writing\n\nLumina uses Gemini Flash to help you summarize, brainstorm, and simplify your thoughts. Try it out now!',
        updatedAt: Date.now(),
        tags: ['welcome']
      };
      setNotes([welcomeNote]);
      setActiveNoteId(welcomeNote.id);
    }
  }, []);

  // Save notes to local storage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('lumina_notes', JSON.stringify(notes));
    }
  }, [notes]);

  const handleCreateNote = useCallback(() => {
    const newNote: Note = {
      id: Math.random().toString(36).substring(2, 11),
      title: '',
      content: '',
      updatedAt: Date.now(),
      tags: []
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  }, []);

  const handleUpdateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  }, []);

  const handleDeleteNote = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => {
        const filtered = prev.filter(n => n.id !== id);
        if (activeNoteId === id) {
          setActiveNoteId(filtered.length > 0 ? filtered[0].id : null);
        }
        return filtered;
      });
    }
  }, [activeNoteId]);

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
        </svg>
      </button>

      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        transition-transform duration-300 ease-in-out
        fixed md:relative z-40 h-full
      `}>
        <Sidebar 
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={(id) => {
            setActiveNoteId(id);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          onNewNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        <Editor 
          note={activeNote}
          onUpdateNote={handleUpdateNote}
        />
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
