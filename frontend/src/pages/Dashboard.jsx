import { useState } from "react";

import MainLayout from "../layout/MainLayout";

import Header from "../components/Header";
import UploadPanel from "../components/UploadPanel";
import Sidebar from "../components/Sidebar";
import ChatPanel from "../components/ChatPanel";

function Dashboard() {
  const [currentConversation, setCurrentConversation] = useState(null);

  const handleNewChat = () => {
    setCurrentConversation(null);
  };

  return (
    <MainLayout>
      <div className="flex h-screen">

        {/* Sidebar */}
        <Sidebar
          currentConversation={currentConversation}
          onSelectConversation={setCurrentConversation}
          onNewChat={handleNewChat}
        />

        {/* Main Area */}
        <div className="flex flex-col flex-1">

          <Header />

          <div className="p-6 border-b bg-gray-50">
            <UploadPanel />
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatPanel
              currentConversation={currentConversation}
              onConversationCreated={setCurrentConversation}
            />
          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;