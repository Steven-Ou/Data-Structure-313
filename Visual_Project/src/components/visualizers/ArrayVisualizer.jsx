import React from 'react';


export const GraphVisualizer = ({ data }) => {
  if (!data || !data.nodes) return <div>No Graph Data</div>;
  const { nodes, edges } = data;
  const width = 400;
  const height = 300;
  const cx = 200;
  const cy = 150;
  const r = 100;

  const getNodePos = (i, total) => {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  return (
    <svg width={width} height={height} className="mx-auto overflow-visible">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="24"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
        </marker>
      </defs>
      {edges.map((e, i) => {
        const start = getNodePos(e.source, nodes.length);
        const end = getNodePos(e.target, nodes.length);
        return (
          <g key={`e-${i}`}>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#cbd5e1"
              strokeWidth="2"
              markerEnd={data.directed ? "url(#arrowhead)" : ""}
            />
            {e.weight > 1 && (
              <text
                x={(start.x + end.x) / 2}
                y={(start.y + end.y) / 2}
                dy="-5"
                textAnchor="middle"
                fill="#ef4444"
                fontSize="10"
                fontWeight="bold"
              >
                {e.weight}
              </text>
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const pos = getNodePos(i, nodes.length);
        return (
          <g key={`n-${n.id}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="16"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <text
              x={pos.x}
              y={pos.y}
              dy="5"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#1e40af"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const TreeVisualizer = ({ root }) => {
  if (!root)
    return <div className="text-slate-400 p-8 text-center">No Tree Data</div>;
  const levels = [];
  const traverse = (node, depth, x, spread) => {
    if (!node) return;
    if (!levels[depth]) levels[depth] = [];
    levels[depth].push({
      x,
      y: 40 + depth * 60,
      val: node.val,
      id: node.id,
      color: node.color,
    });
    traverse(node.left, depth + 1, x - spread, spread / 2);
    traverse(node.right, depth + 1, x + spread, spread / 2);
  };
  traverse(root, 0, 200, 100);

  const renderLines = (node, depth, x, spread) => {
    if (!node) return [];
    return [
      node.left && (
        <line
          key={`l-${node.id}`}
          x1={x}
          y1={40 + depth * 60}
          x2={x - spread}
          y2={40 + (depth + 1) * 60}
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      ),
      ...renderLines(node.left, depth + 1, x - spread, spread / 2),
      node.right && (
        <line
          key={`r-${node.id}`}
          x1={x}
          y1={40 + depth * 60}
          x2={x + spread}
          y2={40 + (depth + 1) * 60}
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      ),
      ...renderLines(node.right, depth + 1, x + spread, spread / 2),
    ];
  };

  return (
    <svg width="400" height="350" className="mx-auto overflow-visible">
      {renderLines(root, 0, 200, 100)}
      {levels.flat().map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r="16"
            fill={n.color === "red" ? "#fee2e2" : "#334155"}
            stroke={n.color === "red" ? "#ef4444" : "#0f172a"}
            strokeWidth="2"
          />
          <text
            x={n.x}
            y={n.y}
            dy="5"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill={n.color === "black" ? "white" : "#1e293b"}
          >
            {n.val}
          </text>
        </g>
      ))}
    </svg>
  );
};

const ArrayVisualizer = ({ data }) => {
  if (!data || !Array.isArray(data))
    return <div className="text-slate-400 p-8 text-center">No Data</div>;
  const maxVal = 50;
  return (
    <div className="flex items-end justify-center gap-2 h-32 w-full px-4 pb-4">
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center w-8 group relative">
          <div className="absolute -top-6 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition">
            [{i}]
          </div>
          <div
            className="w-full bg-indigo-500 rounded-t transition-all duration-300"
            style={{ height: `${Math.max((val / maxVal) * 100, 10)}%` }}
          ></div>
          <span className="text-[10px] font-mono text-slate-500 mt-1">
            {val}
          </span>
        </div>
      ))}
    </div>
  );
};

const StackVisualizer = ({ data }) => {
  if (!data || !data.result) return null;
  return (
    <div className="flex flex-col-reverse items-center gap-1 h-48 w-full p-4 border rounded bg-slate-50 overflow-y-auto">
      {data.result.map((val, i) => (
        <div
          key={i}
          className="w-32 py-2 bg-indigo-100 border border-indigo-200 text-center font-mono rounded shadow-sm"
        >
          {val}
        </div>
      ))}
      <div className="text-xs text-slate-400 uppercase font-bold border-t w-full text-center pt-2">
        Stack Bottom
      </div>
    </div>
  );
};

const PostfixVisualizer = ({ data }) => (
  <div className="flex flex-col items-center justify-center h-full p-4">
    <div className="text-2xl font-mono bg-slate-100 p-4 rounded mb-2 tracking-widest">
      {data ? data.expr : "Loading..."}
    </div>
    <div className="text-sm text-slate-500">
      Operands: Push. Operators: Pop 2, Calc, Push.
    </div>
  </div>
);

const RecurrenceVisualizer = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="text-4xl font-serif italic mb-4 text-slate-700">
      T(n) = ...
    </div>
    <div className="text-sm text-slate-500">Apply Master Theorem cases.</div>
  </div>
);

const HashVisualizer = ({ data }) => {
  if (!data || !data.table)
    return <div className="text-slate-400 p-8">No Hash Data</div>;
  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-2 font-bold text-indigo-600">
        Key: {data.key} ({data.strategy})
      </div>
      <div className="flex gap-1 border p-2 rounded bg-slate-50">
        {data.table.map((val, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 border flex items-center justify-center text-xs ${
                val === null ? "bg-white" : "bg-indigo-100 font-bold"
              }`}
            >
              {val === null ? "∅" : val}
            </div>
            <span className="text-[10px] text-slate-400">{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
};