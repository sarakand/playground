import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';

const WorkdayOrgChart = ({ neo4jData }) => {
  // Transform Neo4j nodes to tree structure
  const transformGraphToTree = () => {
    const nodesMap = {};
    const roots = [];
    
    // Create node map and detect roots
    neo4jData.nodes.forEach(node => {
      nodesMap[node.id] = {
        ...node.properties,
        id: node.id,
        children: []
      };
      
      // Detect root nodes (no incoming relationships)
      if (!neo4jData.relationships.some(rel => rel.endNode === node.id)) {
        roots.push(node.id);
      }
    });
    
    // Build parent-child relationships
    neo4jData.relationships.forEach(rel => {
      if (nodesMap[rel.startNode] && nodesMap[rel.endNode]) {
        nodesMap[rel.startNode].children.push(nodesMap[rel.endNode]);
      }
    });
    
    return roots.map(rootId => nodesMap[rootId]);
  };

  // Render tree recursively
  const renderTreeNode = (node) => (
    <TreeNode 
      key={node.id} 
      label={<OrgNode {...node} />}
    >
      {node.children.map(child => renderTreeNode(child))}
    </TreeNode>
  );

  // Custom Workday-style node component
  const OrgNode = ({ name, title, department, avatar }) => (
    <div style={nodeStyle}>
      {avatar && <img src={avatar} alt={name} style={avatarStyle} />}
      <div style={textContainer}>
        <div style={nameStyle}>{name}</div>
        <div style={titleStyle}>{title}</div>
        <div style={deptStyle}>{department}</div>
      </div>
    </div>
  );

  const treeData = transformGraphToTree();
  
  return (
    <Tree 
      lineWidth="1px"
      lineColor="#ccc"
      lineStyle="dashed"
      nodePadding="15px"
      label={<div style={rootLabel}>Organization Structure</div>}
    >
      {treeData.map(root => renderTreeNode(root))}
    </Tree>
  );
};

// Styling
const nodeStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const avatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  marginRight: '10px'
};

const textContainer = {
  display: 'flex',
  flexDirection: 'column'
};

const nameStyle = {
  fontWeight: 'bold',
  fontSize: '14px'
};

const titleStyle = {
  fontSize: '12px',
  color: '#555'
};

const deptStyle = {
  fontSize: '11px',
  color: '#777'
};

const rootLabel = {
  padding: '10px',
  fontWeight: 'bold',
  backgroundColor: '#f0f8ff',
  border: '1px solid #cce0ff',
  borderRadius: '6px'
};

export default WorkdayOrgChart;
