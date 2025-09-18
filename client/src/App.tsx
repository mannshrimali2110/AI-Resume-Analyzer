import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import Results from "./pages/Results";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analyzer" element={<Analyzer />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;
