import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { Connections } from "./pages/connections/Connections";
import { CreateSASLKafkaConnection } from "./pages/connections/CreateSASLKafkaConnection";
import { CreateSSLKafkaConnection } from "./pages/connections/CreateSSLKafkaConnection";
import { CreateSchema } from "./pages/CreateSchema";
import { Home } from "./pages/home/Home";
import { Schemas } from "./pages/Schemas";
import { Settings } from "./pages/Settings";
import { Topics } from "./pages/Topics";

export const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/topics" element={<Topics />} />
      <Route path="/schemas" element={<Schemas />} />
      <Route path="/schemas/create" element={<CreateSchema />} />
      <Route path="/connections" element={<Connections />} />
      <Route
        path="/connections/create-ssl-kafka"
        element={<CreateSSLKafkaConnection />}
      />
      <Route
        path="/connections/create-sasl-kafka"
        element={<CreateSASLKafkaConnection />}
      />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </Router>
);
