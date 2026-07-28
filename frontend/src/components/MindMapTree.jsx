import { useState } from "react";
import { ChevronRight, ChevronDown, Sparkles, BookOpen, Layers } from "lucide-react";

function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  // Level specific colors
  const depthColors = [
    "from-indigo-600 to-purple-600 text-white border-indigo-400/40 shadow-indigo-500/20",
    "from-slate-800 to-slate-900 text-slate-100 border-indigo-500/30",
    "from-slate-900 to-slate-950 text-slate-200 border-slate-700/80",
    "from-slate-950 to-black text-slate-300 border-slate-800",
  ];

  const colorStyle = depthColors[Math.min(depth, depthColors.length - 1)];

  return (
    <div className="flex flex-col items-start my-2 relative pl-6 border-l-2 border-slate-800/80 hover:border-indigo-500/40 transition-colors">
      
      <div
        onClick={() => setExpanded(!expanded)}
        className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r ${colorStyle} border shadow-lg cursor-pointer transition transform hover:-translate-y-0.5`}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="w-4 h-4 text-indigo-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-indigo-400" />
          )
        ) : (
          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
        )}

        <div className="font-semibold text-xs md:text-sm tracking-wide">
          {node.title}
        </div>

        {node.details && (
          <span className="text-[11px] text-slate-400 font-normal border-l border-slate-700/60 pl-2 ml-1 hidden sm:inline">
            {node.details}
          </span>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="mt-2 space-y-1 w-full">
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MindMapTree({ data }) {
  if (!data) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        No concept tree generated yet.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">{data.title || "Concept Mind Map"}</h2>
            <p className="text-xs text-slate-400">Hierarchical visual breakdown of chapter topics</p>
          </div>
        </div>
      </div>

      {/* Mind Map Canvas Area */}
      <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-x-auto custom-scrollbar min-h-[350px]">
        <TreeNode node={data} depth={0} />
      </div>

    </div>
  );
}
