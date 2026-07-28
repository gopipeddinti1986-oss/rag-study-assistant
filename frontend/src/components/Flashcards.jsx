import { useEffect, useState } from "react";
import { generateFlashcards } from "../api/api";
import { RotateCw, ArrowLeft, ArrowRight, Sparkles, CheckCircle, HelpCircle, Layers } from "lucide-react";

function Flashcards() {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [knownCount, setKnownCount] = useState(0);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await generateFlashcards(10);
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data.flashcards) {
        list = data.flashcards;
      }
      setCards(list);
      setCurrent(0);
      setKnownCount(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = (known = false) => {
    setFlipped(false);
    if (known) setKnownCount((prev) => prev + 1);

    if (current < cards.length - 1) {
      setCurrent(current + 1);
    }
  };

  const previousCard = () => {
    setFlipped(false);
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Generating AI flashcards from vector store...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white">No Flashcards Available</h3>
        <p className="text-xs text-slate-400">Upload a PDF or TXT file first to generate study cards.</p>
        <button
          onClick={loadCards}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold transition"
        >
          Try Generating Again
        </button>
      </div>
    );
  }

  const card = cards[current];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Meta Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" /> 3D Flip Deck
          </div>
          <h2 className="text-2xl font-black text-white">Active Flashcard Session</h2>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
            Mastered: {knownCount} / {cards.length}
          </div>
          <button
            onClick={loadCards}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
            title="Reload Cards"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className="bg-orange-500 h-full transition-all duration-300"
          style={{ width: `${((current + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 w-full min-h-[320px]">
        <div
          onClick={() => setFlipped(!flipped)}
          className={`relative w-full h-80 rounded-3xl cursor-pointer transition-all duration-500 transform-style-3d shadow-2xl ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Card Front (Question) */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border-2 border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <span>Question ({current + 1}/{cards.length})</span>
              <span className="text-slate-500 text-[10px]">Click to flip 🔄</span>
            </div>

            <div className="text-xl md:text-2xl font-bold text-white text-center leading-relaxed">
              {card.question}
            </div>

            <div className="text-center text-xs text-slate-500 italic">
              Tap card to view answer
            </div>
          </div>

          {/* Card Back (Answer) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/40 rounded-3xl p-8 md:p-12 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              <span>Answer & Explanation</span>
              <span className="text-slate-500 text-[10px]">Click to flip back 🔄</span>
            </div>

            <div className="text-lg md:text-xl font-medium text-slate-100 text-center leading-relaxed">
              {card.answer}
            </div>

            <div className="text-center text-xs text-emerald-400/80 font-medium">
              💡 Concept Answer
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={previousCard}
          disabled={current === 0}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition disabled:opacity-30 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => nextCard(false)}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Need Review
          </button>

          <button
            onClick={() => nextCard(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Mastered
          </button>
        </div>

        <button
          onClick={() => nextCard(false)}
          disabled={current === cards.length - 1}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition disabled:opacity-30 flex items-center gap-1.5"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

export default Flashcards;