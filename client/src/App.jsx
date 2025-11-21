import Navbar from "./components/Navbar";
import AppRouter from "./router/AppRouter";
import Footer from "./components/Footer";
import OfflineIndicator from "./components/OfflineIndicator";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="grow">
        <AppRouter />
      </main>

      <Footer />
      <OfflineIndicator />
    </div>
  );
}
