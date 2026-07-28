import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UploadPanel from "../components/UploadPanel";
import ChatPanel from "../components/ChatPanel";
import Bookmarks from "../components/Bookmarks";
import Flashcards from "../components/Flashcards";

function Dashboard() {
  const [activePage, setActivePage] = useState("chat");
  const [currentConversation, setCurrentConversation] = useState(null);

  const handleUploadSuccess = (conversationId) => {
    setCurrentConversation(conversationId);
    setActivePage("chat");
  };

  const handleNewChat = () => {
    setCurrentConversation(null);
    setActivePage("chat");
  };

  return (
    <MainLayout>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">

        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          currentConversation={currentConversation}
          onSelectConversation={(conversationId) => {
            setCurrentConversation(conversationId);
            setActivePage("chat");
          }}
          onNewChat={handleNewChat}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />

          <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

            {activePage === "bookmarks" && (
              <div className="h-full overflow-y-auto p-6 custom-scrollbar">
                <Bookmarks />
              </div>
            )}

            {activePage === "flashcards" && (
              <div className="h-full overflow-y-auto p-6 custom-scrollbar">
                <Flashcards />
              </div>
            )}

            {activePage === "upload" && (
              <div className="h-full overflow-y-auto p-8 max-w-3xl mx-auto custom-scrollbar flex items-center justify-center">
                <div className="w-full">
                  <UploadPanel onUploadSuccess={handleUploadSuccess} />
                </div>
              </div>
            )}

            {activePage === "chat" && (
              <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
                {/* Left Panel: Upload & Quick Info (4 columns) */}
                <div className="hidden lg:block lg:col-span-4 p-6 border-r border-slate-800 bg-slate-900/60 overflow-y-auto custom-scrollbar">
                  <UploadPanel onUploadSuccess={handleUploadSuccess} />
                </div>

                {/* Right Panel: AI Chat (8 columns) */}
                <div className="col-span-1 lg:col-span-8 h-full overflow-hidden">
                  <ChatPanel
                    currentConversation={currentConversation}
                    onConversationCreated={setCurrentConversation}
                  />
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;