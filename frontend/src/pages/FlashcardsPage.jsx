import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Flashcards from "../components/Flashcards";

export default function FlashcardsPage() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      <Sidebar activePage="flashcards" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
          <Flashcards />
        </main>
      </div>
    </div>
  );
}
