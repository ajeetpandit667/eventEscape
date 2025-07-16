import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Host from "./pages/Host";
// import Discover from './pages/Discover';
// import HostEvent from './pages/Host';
// Add more pages

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/discover" element={<Discover />} /> */}
        <Route path="/host" element={<Host />} />
        {/* More routes */}
      </Routes>
    </Router>
  );
}

export default App;