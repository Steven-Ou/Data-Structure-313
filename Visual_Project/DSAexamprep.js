import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Code, RefreshCw, CheckCircle, XCircle, Activity, GitBranch, Database, Layers, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';

class TreeNode {
  constructor(val, color = "white") {
    this.val = val;
    this.left = null;
    this.right = null;
    this.color = color; // For RBT
    this.height = 1;    // For AVL
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

const generateGraph = (numNodes = 5, directed = false, weighted = true) => {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i, label: String.fromCharCode(65 + i) }));
  const edges = [];
  const matrix = Array(numNodes).fill(null).map(() => Array(numNodes).fill(0));
  
  // Create a spanning tree first to ensure connectivity
  const connected = new Set([0]);
  const pool = Array.from({length: numNodes - 1}, (_, i) => i + 1);
  
  while(pool.length > 0) {
    const targetIdx = Math.floor(Math.random() * pool.length);
    const target = pool.splice(targetIdx, 1)[0];
    const source = Array.from(connected)[Math.floor(Math.random() * connected.size)];
    
    const weight = weighted ? Math.floor(Math.random() * 9) + 1 : 1;
    edges.push({ source, target, weight });
    matrix[source][target] = weight;
    if (!directed) matrix[target][source] = weight;
    connected.add(target);
  }

  for (let i = 0; i < numNodes; i++) {
    if (Math.random() > 0.7) {
      const target = Math.floor(Math.random() * numNodes);
      if (target !== i && matrix[i][target] === 0) {
         const weight = weighted ? Math.floor(Math.random() * 9) + 1 : 1;
         edges.push({ source: i, target, weight });
         matrix[i][target] = weight;
         if (!directed) matrix[target][i] = weight;
      }
    }
  }
  return { nodes, edges, matrix };
};

const generateBSTData = (count = 10) => {
  const rootVal = Math.floor(Math.random() * 40) + 30;
  const root = new TreeNode(rootVal);
  const values = [rootVal];
  
  for(let i=0; i<count; i++) {
    const val = Math.floor(Math.random() * 100);
    if(values.includes(val)) continue;
    values.push(val);
    
    let curr = root;
    while(true) {
      if(val < curr.val) {
        if(!curr.left) { curr.left = new TreeNode(val); break; }
        curr = curr.left;
      } else {
        if(!curr.right) { curr.right = new TreeNode(val); break; }
        curr = curr.right;
      }
    }
  }
  return { root, values };
};
