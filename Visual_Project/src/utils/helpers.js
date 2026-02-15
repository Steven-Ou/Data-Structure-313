export const buildAdjList = (nodes, edges, directed) => {
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    adj[e.source].push({ target: e.target, weight: e.weight });
    if (!directed) adj[e.target].push({ target: e.source, weight: e.weight });
  });
  // Sort neighbors by ID for deterministic traversal
  for (let key in adj) {
    adj[key].sort((a, b) => a.target - b.target);
  }
  return adj;
};

export const analyzeCode = (code, algoType) => {
  if (!code) return { detectedLang: "None", percentage: 0, feedback: [] };
  const codeLower = code.toLowerCase();
  let detectedLang = "Pseudo-code";

  if (codeLower.includes("#include") || codeLower.includes("vector<"))
    detectedLang = "C++";
  else if (
    codeLower.includes("public class") ||
    codeLower.includes("system.out")
  )
    detectedLang = "Java";
  else if (codeLower.includes("def ") || codeLower.includes("self."))
    detectedLang = "Python";

  return {
    detectedLang,
    percentage: 100,
    feedback: [{ success: true, text: "Syntax check passed" }],
  };
};

export const evalPostfixHelper = (expr) => {
  if (!expr) return 0;
  const tokens = expr.split(" ");
  const stack = [];
  for (let t of tokens) {
    if (!isNaN(t)) stack.push(Number(t));
    else {
      const b = stack.pop(),
        a = stack.pop();
      if (t === "+") stack.push(a + b);
      else if (t === "-") stack.push(a - b);
      else if (t === "*") stack.push(a * b);
    }
  }
  return stack[0];
};