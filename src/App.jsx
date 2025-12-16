import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactFlow, { Background, Controls, useReactFlow, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { layoutTree } from './utils/treeLayout';
import NoteEditor from './components/NoteEditor';
import Toolbar from './components/Toolbar';

const initialTreeData = {
  id: 'root',
  label: 'Root Node',
  data: { label: 'Root Node', content: '# Welcome\nThis is your root note.' },
  children: [
    {
      id: '1',
      label: 'Idea 1',
      data: { label: 'Idea 1', content: 'Details about idea 1.' },
      children: []
    },
    {
      id: '2',
      label: 'Idea 2',
      data: { label: 'Idea 2', content: 'Details about idea 2.' },
      children: []
    }
  ]
};

function TreeVisualizer() {
  const [tree, setTree] = useState(initialTreeData);
  const [collapsed, setCollapsed] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);
  const { setCenter, zoomTo } = useReactFlow();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('obsidian-tree-data');
    if (saved) {
      try {
        setTree(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load tree', e);
      }
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem('obsidian-tree-data', JSON.stringify(tree));
  }, [tree]);

  const { nodes, edges } = useMemo(() => {
    return layoutTree(tree, 0, 0, collapsed, highlightedNodeId);
  }, [tree, collapsed, highlightedNodeId]);

  const onNodeClick = useCallback((_, node) => {
    if (selectedNode && selectedNode.id === node.id) {
      setCollapsed(prev => ({ ...prev, [node.id]: !prev[node.id] }));
    } else {
      const findNode = (n) => {
        if (n.id === node.id) return n;
        if (n.children) {
          for (let child of n.children) {
            const found = findNode(child);
            if (found) return found;
          }
        }
        return null;
      };
      const interactionNode = findNode(tree);
      setSelectedNode(interactionNode);
    }
  }, [selectedNode, tree]);

  const handleAddNode = () => {
    if (!selectedNode) return alert("Select a node to add a child to.");

    const newNode = {
      id: crypto.randomUUID(),
      label: 'New Note',
      data: { label: 'New Note', content: '' },
      children: []
    };

    const addNodeRecursive = (n) => {
      if (n.id === selectedNode.id) {
        return { ...n, children: [...(n.children || []), newNode] };
      }
      if (n.children) {
        return { ...n, children: n.children.map(addNodeRecursive) };
      }
      return n;
    };

    setTree(prev => addNodeRecursive(prev));
    setCollapsed(prev => ({ ...prev, [selectedNode.id]: false })); // Ensure expanded
  };

  const handleDeleteNode = () => {
    if (!selectedNode || selectedNode.id === 'root') return alert("Cannot delete root or no node selected.");
    if (!confirm("Delete this note and its children?")) return;

    const deleteRecursive = (n) => {
      if (!n.children) return n;
      return {
        ...n,
        children: n.children.filter(c => c.id !== selectedNode.id).map(deleteRecursive)
      };
    };

    setTree(prev => deleteRecursive(prev));
    setSelectedNode(null);
  };

  const handleReset = () => {
    if (confirm("Reset everything?")) {
      setTree(initialTreeData);
      setCollapsed({});
      setSelectedNode(null);
      localStorage.removeItem('obsidian-tree-data');
    }
  };

  const handleSaveNote = (id, newContent) => {
    const updateRecursive = (n) => {
      if (n.id === id) {
        const label = newContent.split('\n')[0].replace(/^#+\s*/, '') || 'Untitled';
        return { ...n, label, data: { ...n.data, content: newContent, label } };
      }
      if (n.children) {
        return { ...n, children: n.children.map(updateRecursive) };
      }
      return n;
    };
    setTree(prev => updateRecursive(prev));
    setSelectedNode(prev => ({ ...prev, data: { ...prev.data, content: newContent } }));
  };

  const handleSearch = (term) => {
    if (!term) {
      setHighlightedNodeId(null);
      return;
    }

    const findNode = (n) => {
      if (n.data.label.toLowerCase().includes(term.toLowerCase())) return n;
      if (n.children) {
        for (let child of n.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };

    const found = findNode(tree);
    if (found) {
      setHighlightedNodeId(found.id);
      const targetNode = nodes.find(n => n.id === found.id);
      if (targetNode) {
        setCenter(targetNode.position.x, targetNode.position.y, { zoom: 1.5, duration: 1000 });
        setSelectedNode(found);
      }
    } else {
      alert("No note found.");
      setHighlightedNodeId(null);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#121212' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Toolbar onAdd={handleAddNode} onDelete={handleDeleteNode} onReset={handleReset} onSearch={handleSearch} />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          minZoom={0.1}
        >
          <Background color="#333" gap={20} />
          <Controls />
        </ReactFlow>
      </div>
      {selectedNode && (
        <NoteEditor
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onSave={handleSaveNote}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <TreeVisualizer />
    </ReactFlowProvider>
  );
}
