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