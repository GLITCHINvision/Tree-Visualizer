import React, { useState } from 'react';
import { Plus, Trash2, Search, RefreshCw } from 'lucide-react';

export default function Toolbar({ onAdd, onDelete, onReset, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 10,
      display: 'flex',
      gap: '12px',
      background: 'rgba(30, 30, 30, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '10px 16px',
      borderRadius: '12px',
      border: '1px solid #444',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: '#333',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 10px',
            color: '#fff',
            outline: 'none',
            width: '150px'
          }}
        />
        <button type="submit" style={btnStyle} title="Search">
          <Search size={18} />
        </button>
      </form>
      <div style={{ width: '1px', background: '#555', margin: '0 4px' }}></div>
      <button onClick={onAdd} style={btnStyle} title="Add Child Node">
        <Plus size={18} color="#4caf50" />
      </button>
      <button onClick={onDelete} style={btnStyle} title="Delete Selected Node">
        <Trash2 size={18} color="#ff5252" />
      </button>
      <button onClick={onReset} style={btnStyle} title="Reset Tree">
        <RefreshCw size={18} color="#2196f3" />
      </button>
    </div>
  );
}

const btnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px',
  borderRadius: '6px',
  transition: 'background 0.2s',
  color: '#e0e0e0',
};
