import "./index.scss";
import "./fonts/fonts.scss";
import { createRoot } from "react-dom/client";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>hello</div>} />
      </Routes>
    </Router>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
