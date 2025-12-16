import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Save, Eye, Edit2 } from 'lucide-react';

export default function NoteEditor({ node, onClose, onSave }) {
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (node) {
      setContent(node.data.content || '');
    }
  }, [node]);

  const handleSave = () => {
    onSave(node.id, content);
  };

  if (!node) return null;

  return (
    <div style={{
      width: '400px',
      height: '100%',
      backgroundColor: '#1e1e1e',
      borderLeft: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      color: '#e0e0e0',
      boxShadow: '-4px 0 15px rgba(0,0,0,0.3)',
      transition: 'transform 0.3s ease',
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#252526'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{node.data.label}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsPreview(!isPreview)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ccc',
              cursor: 'pointer',
              padding: '4px'
            }}
            title={isPreview ? "Edit" : "Preview"}
          >
            {isPreview ? <Edit2 size={18} /> : <Eye size={18} />}
          </button>
          <button
            onClick={handleSave}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4caf50',
              cursor: 'pointer',
              padding: '4px'
            }}
            title="Save"
          >
            <Save size={18} />
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ff5252',
              cursor: 'pointer',
              padding: '4px'
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {isPreview ? (
          <div className="markdown-preview" style={{ lineHeight: '1.6' }}>
            <ReactMarkdown>{content || '*No content yet...*'}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Write your notes here..."
            style={{
              width: '100%',
              height: '100%',
              background: '#1e1e1e',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'monospace',
              resize: 'none',
              outline: 'none'
            }}
          />
        )}
      </div>
    </div>
  );
}
