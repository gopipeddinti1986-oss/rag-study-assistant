import MainLayout from "./layout/MainLayout";
import Header from "./components/Header";
import UploadPanel from "./components/UploadPanel";
import ChatPanel from "./components/ChatPanel";

function App() {
  return (
    <MainLayout>
      <Header />

      <main className="grid grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
        <UploadPanel />
        <ChatPanel />
      </main>
    </MainLayout>
  );
}

export default App;