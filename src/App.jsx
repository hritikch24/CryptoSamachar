import Header from './components/Header';
import Footer from './components/Footer';
import TokenComparison from './components/TokenComparison';
import NewsFeed from './components/NewsFeed';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 space-y-8">
        <TokenComparison />
        <NewsFeed />
      </main>
      <Footer />
    </div>
  );
}

export default App;
