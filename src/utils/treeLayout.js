export const NODE_WIDTH = 120;
export const LEVEL_HEIGHT = 120;

export function layoutTree(node, depth = 0, xOffset = 0, collapsed = {}, highlightedNodeId = null) {
  const finalNodes = [];
  const finalEdges = [];

  

  function traverse(node, depth, xOffset, ancestorPos = null) {
    const isCollapsed = collapsed[node.id];
    const isHidden = ancestorPos !== null;

    let childrenWidth = 0;
    const childResults = [];

    if (node.children) {
      

      const nextAncestorPos = isHidden ? ancestorPos : (isCollapsed ? { x: 0, y: 0 } : null);
     
      if (!isHidden && !isCollapsed) {
        node.children.forEach(child => {
          const result = traverse(child, depth + 1, xOffset + childrenWidth, null);
          childrenWidth += result.width;
          childResults.push(result);
        });
      }

      
    }

    const width = Math.max(childrenWidth, NODE_WIDTH);

    

    let x, y;

    if (isHidden) {
      x = ancestorPos.x;
      y = ancestorPos.y;
    } else {
      x = xOffset + width / 2 - NODE_WIDTH / 2;
      y = depth * LEVEL_HEIGHT;
    }

    const position = { x, y };

    const isHighlighted = node.id === highlightedNodeId;
    const isDimmed = highlightedNodeId && !isHighlighted;
    const opacity = isHidden ? 0 : (isDimmed ? 0.3 : 1);
    const pointerEvents = isHidden ? 'none' : 'all';

    finalNodes.push({
      id: node.id,
      data: { label: node.data.label || node.label },
      position,
      style: {
        border: isHighlighted ? '2px solid #2196f3' : '1px solid #444',
        padding: '10px',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: isHighlighted ? '#2b2b2b' : '#1e1e1e',
        color: '#e0e0e0',
        boxShadow: isHighlighted ? '0 0 15px rgba(33, 150, 243, 0.5)' : '0 2px 4px rgba(0,0,0,0.3)',
        textAlign: 'center',
        fontSize: '14px',
        width: NODE_WIDTH - 20,
        opacity,
        pointerEvents,
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
      }
    });

    
    if (node.children) {
      if (isHidden || isCollapsed) {
        
        node.children.forEach(child => {
          traverse(child, depth + 1, 0, position); 
        });
      }
    }

   
    if (node.children) {
      node.children.forEach(child => {
      

        const childCollapsed = collapsed[node.id]; 

        const edgeOpacity = (isHidden || childCollapsed) ? 0 : (isDimmed ? 0.3 : 1);

        finalEdges.push({
          id: `${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'smoothstep',
          animated: edgeOpacity > 0, 
          style: {
            stroke: isHighlighted ? '#2196f3' : '#555',
            opacity: edgeOpacity,
            transition: 'opacity 0.5s ease'
          }
        });
      });
    }

    return { width: isHidden ? 0 : width }; 
  }

  traverse(node, depth, xOffset);

  return { nodes: finalNodes, edges: finalEdges };
}
