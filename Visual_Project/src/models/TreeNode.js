export class TreeNode {
  constructor(val, color = "red") {
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = color;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}