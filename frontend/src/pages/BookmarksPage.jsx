import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Bookmarks from "../components/Bookmarks";

export default function BookmarksPage() {
  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      <Sidebar activePage="bookmarks" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <Bookmarks />
        </main>
      </div>
    </div>
  );
}
