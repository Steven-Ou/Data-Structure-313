import React, { useState, useEffect } from "react";
import {
  Activity,
  GitBranch,
  Database,
  BarChart,
  List,
  Hash,
  RefreshCw,
  CheckCircle,
  XCircle,
  Search,
  Calculator,
} from "lucide-react";

// --- DATA STRUCTURE CLASSES ---


// --- HELPER FUNCTIONS ---


// --- STATIC CODE ANALYZER ENGINE ---


// --- GENERATORS ---

// --- VISUALIZERS (Defined before use) ---

// --- ALGORITHMS ENGINE ---


// --- MAIN COMPONENT ---

export default function DSAExamPrep() {
  const [activeAlgo, setActiveAlgo] = useState("linear_search");
  const [codeLang, setCodeLang] = useState("java");
  const [problemData, setProblemData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [recInputs, setRecInputs] = useState({
    height: "",
    size: "",
    work: "",
    complexity: "",
  });
  const [feedback, setFeedback] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTrace, setShowTrace] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [codeReport, setCodeReport] = useState(null);

  const currentAlgo = algorithms[activeAlgo] || algorithms["linear_search"];

  const generateNewProblem = () => {
    setFeedback(null);
    setShowSolution(false);
    setShowHint(false);
    setShowTrace(false);
    setUserAnswer("");
    setRecInputs({ height: "", size: "", work: "", complexity: "" });
    setCodeReport(null);
    setUserCode(`// Implement ${currentAlgo.name} here...`);

    const cat = currentAlgo.category;
    if (cat === "Graphs")
      setProblemData(
        generateGraph(5, activeAlgo !== "kruskal", activeAlgo !== "bfs"),
      );
    else if (cat === "Trees") {
      if (activeAlgo === "heap_ops") setProblemData(generateHeapData());
      else
        setProblemData(generateBSTData(activeAlgo.includes("rotate") ? 5 : 7));
    } else if (cat === "Sorting" || cat === "Searching")
      setProblemData(generateSortData(7));
    else if (cat === "Linear") {
      if (activeAlgo === "stack_ops") setProblemData(generateStackData());
      else if (activeAlgo === "postfix_eval")
        setProblemData(generatePostfixData());
      else setProblemData(generateSortData(5));
    } else if (cat === "Hashing") setProblemData(generateHashData(7));
    else if (cat === "Recurrences") setProblemData({});
  };

  useEffect(() => {
    generateNewProblem();
  }, [activeAlgo]);

  const checkAnswer = () => {
    if (currentAlgo.category === "Recurrences") {
      const expected = currentAlgo.expected || {};
      const clean = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
      const isHeightCorrect = clean(recInputs.height).includes(
        clean(expected.height),
      );
      const isSizeCorrect =
        clean(recInputs.size).includes(clean(expected.size)) ||
        clean(expected.size) === "varies";
      const isWorkCorrect = clean(recInputs.work).includes(
        clean(expected.work),
      );
      const isComplexCorrect = clean(recInputs.complexity).includes(
        clean(expected.complexity),
      );

      setFeedback(
        isHeightCorrect && isSizeCorrect && isWorkCorrect && isComplexCorrect
          ? "correct"
          : "incorrect",
      );
    } else {
      const correct = String(currentAlgo.solve(problemData));
      const userClean = userAnswer.toLowerCase().replace(/[^a-z0-9]/g, "");
      const correctClean = correct.toLowerCase().replace(/[^a-z0-9]/g, "");

      if (correctClean.includes(userClean) && userClean.length > 2)
        setFeedback("correct");
      else setFeedback(userClean === correctClean ? "correct" : "incorrect");
      setCodeReport(analyzeCode(userCode, activeAlgo));
    }
  };

  const renderVisualizer = () => {
    if (!problemData && currentAlgo.category !== "Recurrences")
      return <div>Loading...</div>;
    const cat = currentAlgo.category;
    if (cat === "Graphs") return <GraphVisualizer data={problemData} />;
    if (cat === "Trees")
      return activeAlgo.includes("heap") ? (
        <ArrayVisualizer data={problemData} />
      ) : (
        <TreeVisualizer root={problemData.root} />
      );
    if (cat === "Sorting" || cat === "Searching")
      return <ArrayVisualizer data={problemData} />;
    if (activeAlgo === "stack_ops")
      return <StackVisualizer data={problemData} />;
    if (activeAlgo === "postfix_eval")
      return <PostfixVisualizer data={problemData} />;
    if (cat === "Hashing") return <HashVisualizer data={problemData} />;
    if (cat === "Recurrences") return <RecurrenceVisualizer />;
    return <div>Visualizer not available</div>;
  };

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row overflow-hidden">
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Activity /> DSA Prep
        </div>
        <div className="p-4 space-y-6">
          <SidebarSection
            title="Searching"
            items={["linear_search", "binary_search"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Search size={16} />}
          />
          <SidebarSection
            title="Sorting"
            items={[
              "bubble_sort",
              "insertion_sort",
              "selection_sort",
              "merge_sort",
              "quick_sort",
              "randomized_quick_sort",
            ]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<BarChart size={16} />}
          />
          <SidebarSection
            title="Linear"
            items={["stack_ops", "postfix_eval"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<List size={16} />}
          />
          <SidebarSection
            title="Graphs"
            items={["bfs", "dfs", "dijkstra", "kruskal"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<GitBranch size={16} />}
          />
          <SidebarSection
            title="Trees/Heaps"
            items={[
              "bst_ops",
              "left_rotate",
              "right_rotate",
              "rbt_ops",
              "heap_ops",
            ]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Database size={16} />}
          />
          <SidebarSection
            title="Hashing"
            items={["hashing"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Hash size={16} />}
          />
          <SidebarSection
            title="Recurrences"
            items={["recurrence_a", "recurrence_c", "recurrence_j"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Calculator size={16} />}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold text-slate-800">
            {currentAlgo.name}
          </h1>
          <button
            onClick={generateNewProblem}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium text-sm"
          >
            <RefreshCw size={16} /> New Problem
          </button>
        </header>

        <div className="flex-1 overflow-hidden p-6 bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[300px] shrink-0">
                <div className="bg-slate-50 border-b border-slate-100 p-3 text-xs font-medium text-slate-500 uppercase tracking-wide text-center">
                  Visualization
                </div>
                <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
                  {renderVisualizer()}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 shrink-0">
                <h3 className="font-bold text-lg mb-2">Question</h3>
                <p className="text-slate-600 mb-4">
                  {problemData
                    ? typeof currentAlgo.question === "function"
                      ? currentAlgo.question(problemData)
                      : currentAlgo.question
                    : currentAlgo.category === "Recurrences"
                      ? currentAlgo.question
                      : "Loading..."}
                </p>
                {showHint && (
                  <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-sm rounded border border-amber-200">
                    Hint: {currentAlgo.hint}
                  </div>
                )}

                {currentAlgo.category === "Recurrences" ? (
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Height
                      </label>
                      <input
                        type="text"
                        value={recInputs.height}
                        onChange={(e) =>
                          setRecInputs({ ...recInputs, height: e.target.value })
                        }
                        className="w-full border p-2 rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Size of ith
                      </label>
                      <input
                        type="text"
                        value={recInputs.size}
                        onChange={(e) =>
                          setRecInputs({ ...recInputs, size: e.target.value })
                        }
                        className="w-full border p-2 rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Work
                      </label>
                      <input
                        type="text"
                        value={recInputs.work}
                        onChange={(e) =>
                          setRecInputs({ ...recInputs, work: e.target.value })
                        }
                        className="w-full border p-2 rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Complexity
                      </label>
                      <input
                        type="text"
                        value={recInputs.complexity}
                        onChange={(e) =>
                          setRecInputs({
                            ...recInputs,
                            complexity: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 items-center mb-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => {
                        setUserAnswer(e.target.value);
                        setFeedback(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                      className="border p-2 rounded flex-1"
                      placeholder="Enter answer..."
                    />
                  </div>
                )}

                {showTrace && currentAlgo.category !== "Recurrences" && (
                  <div className="mb-4 p-3 bg-slate-100 text-slate-700 text-sm rounded border border-slate-200 font-mono">
                    <span className="font-bold">Answer: </span>{" "}
                    {String(currentAlgo.solve(problemData))}
                  </div>
                )}

                {showTrace && currentAlgo.category === "Recurrences" && (
                  <div className="mb-4 p-3 bg-slate-100 text-slate-700 text-sm rounded border border-slate-200 font-mono">
                    <div className="font-bold border-b border-slate-300 pb-1 mb-1">
                      Expected:
                    </div>
                    <div>Height: {currentAlgo.expected.height}</div>
                    <div>Size: {currentAlgo.expected.size}</div>
                    <div>Work: {currentAlgo.expected.work}</div>
                    <div>Complexity: {currentAlgo.expected.complexity}</div>
                  </div>
                )}

                <div className="flex gap-3 items-center">
                  <button
                    onClick={checkAnswer}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                  >
                    Check
                  </button>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-slate-500 hover:text-indigo-600"
                  >
                    Show Hint
                  </button>
                  <button
                    onClick={() => setShowTrace(!showTrace)}
                    className="text-xs text-slate-500 hover:text-indigo-600"
                  >
                    {showTrace ? "Hide Answer" : "Reveal Answer"}
                  </button>
                </div>
                {feedback && (
                  <div
                    className={`mt-2 flex items-center gap-2 font-bold ${
                      feedback === "correct" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {feedback === "correct" ? ( //If correct show its correct
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}{" "}
                    {feedback === "correct" ? "Correct!" : "Incorrect"}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col flex-1 bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-slate-700">
              <div className="bg-[#252526] p-2 border-b border-[#333] flex justify-between items-center">
                <div className="flex gap-1">
                  {["java", "cpp", "python", "pseudo"].map(
                    (
                      lang, //The container holding all the language
                    ) => (
                      <button
                        key={lang}
                        onClick={() => setCodeLang(lang)}
                        className={`px-3 py-1 text-xs rounded uppercase font-bold transition-colors ${
                          codeLang === lang
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:text-white hover:bg-[#333]"
                        }`}
                      >
                        {lang}
                      </button>
                    ),
                  )}
                </div>
                <button //To reveal the solution
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {showSolution ? "Hide Key" : "Reveal Key"}
                </button>
              </div>
              <div className="flex-1 relative font-mono text-sm overflow-hidden">
                {showSolution ? (
                  <div className="absolute inset-0 p-4 text-[#d4d4d4] overflow-auto whitespace-pre-wrap">
                    {currentAlgo.codes
                      ? currentAlgo.codes[codeLang] || "// Code not available"
                      : "// No code"}
                  </div>
                ) : (
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 resize-none outline-none"
                    spellCheck="false"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//Menu
const SidebarSection = ({ title, items, active, set, icon }) => (
  <div className="mb-4">
    <h3 className="text-xs font-bold text-slate-400 uppercase px-2 mb-2">
      {title}
    </h3>
    {items.map((id) => (
      <button
        key={id}
        onClick={() => set(id)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
          active === id
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-500 hover:bg-slate-50"
        }`}
      >
        {icon}{" "}
        <span className="capitalize">
          {id.replace(/_/g, " ").replace("dp", "DP")}
        </span>
      </button>
    ))}
  </div>
);
