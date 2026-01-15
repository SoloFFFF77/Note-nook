
import React, { useState, useEffect } from 'react';
import { Note, AIAction } from '../types';
import { processNoteWithAI } from '../services/geminiService';

interface EditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

const Editor: React.FC<EditorProps> = ({ note, onUpdateNote }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [lastAIResult, setLastAIResult] = useState<string | null>(null);

  useEffect(() => {
    // Reset AI state when switching notes
    setLastAIResult(null);
    setAiPanelOpen(false);
  }, [note?.id]);

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8 text-center">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-slate-600 mb-2">Select a note to view</h2>
        <p className="max-w-xs">Pick a note from the sidebar or create a new one to start writing with AI power.</p>
      </div>
    );
  }

  const handleAIAction = async (action: AIAction) => {
    if (!note.content.trim()) return;
    
    setIsProcessing(true);
    setAiPanelOpen(true);
    const result = await processNoteWithAI(note.content, action);
    setLastAIResult(result);
    setIsProcessing(false);
  };

  const applyAIResult = () => {
    if (lastAIResult) {
      onUpdateNote(note.id, { 
        content: note.content + "\n\n---\n" + lastAIResult,
        updatedAt: Date.now()
      });
      setLastAIResult(null);
      setAiPanelOpen(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      <div className="border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex-1">
          <input
            type="text"
            value={note.title}
            onChange={(e) => onUpdateNote(note.id, { title: e.target.value, updatedAt: Date.now() })}
            placeholder="Note Title"
            className="text-2xl font-bold text-slate-800 bg-transparent border-none focus:ring-0 w-full placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              aiPanelOpen 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Tools
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <textarea
          value={note.content}
          onChange={(e) => onUpdateNote(note.id, { content: e.target.value, updatedAt: Date.now() })}
          placeholder="Start writing..."
          className="flex-1 p-8 text-lg text-slate-700 leading-relaxed resize-none focus:ring-0 border-none placeholder:text-slate-300"
        />

        {aiPanelOpen && (
          <div className="w-full md:w-96 border-l border-slate-100 bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <span className="text-indigo-500">✨</span> Lumina AI Assistant
              </h3>
              <button onClick={() => setAiPanelOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!lastAIResult && !isProcessing && (
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">What would you like to do?</p>
                  <AIActionButton label="Summarize" icon="📝" onClick={() => handleAIAction('summarize')} description="Create a bullet-point summary" />
                  <AIActionButton label="Improve Writing" icon="✍️" onClick={() => handleAIAction('improve')} description="Fix grammar and flow" />
                  <AIActionButton label="Brainstorm Ideas" icon="💡" onClick={() => handleAIAction('brainstorm')} description="Get 5 related creative ideas" />
                  <AIActionButton label="Simplify" icon="🌱" onClick={() => handleAIAction('simplify')} description="Make it easier to read" />
                  <AIActionButton label="Expand" icon="🔍" onClick={() => handleAIAction('expand')} description="Add more depth and detail" />
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 font-medium">Processing your note...</p>
                  <p className="text-xs text-slate-400 mt-1">Lumina is thinking</p>
                </div>
              )}

              {lastAIResult && !isProcessing && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-700 text-sm whitespace-pre-wrap">
                    {lastAIResult}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={applyAIResult}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Append to Note
                    </button>
                    <button
                      onClick={() => setLastAIResult(null)}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-indigo-50/50 border-t border-slate-100">
              <p className="text-[10px] text-indigo-400 text-center uppercase tracking-widest font-bold">
                Powered by Gemini Flash 3
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AIActionButton: React.FC<{ label: string, icon: string, description: string, onClick: () => void }> = ({ label, icon, description, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group text-left"
  >
    <span className="text-xl">{icon}</span>
    <div>
      <div className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{label}</div>
      <div className="text-[11px] text-slate-400">{description}</div>
    </div>
  </button>
);

export default Editor;
