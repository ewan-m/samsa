import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Connections } from "./pages/connections/Connections";
import { CreateSASLKafkaConnection } from "./pages/connections/CreateSASLKafkaConnection";
import { CreateSSLKafkaConnection } from "./pages/connections/CreateSSLKafkaConnection";
import { CreateSchema } from "./pages/schemas/CreateSchema";
import { Home } from "./pages/home/Home";
import { Schemas } from "./pages/schemas/Schemas";
import { Settings } from "./pages/Settings";
import { Topics } from "./pages/topics/Topics";
import { ViewSchema } from "./pages/schemas/ViewSchema";
import { useTabsState } from "./hooks/useTabState";
import { useEffect } from "react";

const AppRoutes = () => {
  const [{ initialPath }] = useTabsState();
  const navigate = useNavigate();
  useEffect(() => {
    if (initialPath) {
      navigate(initialPath);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/topics" element={<Topics />} />
      <Route path="/schemas" element={<Schemas />} />
      <Route path="/schemas/create" element={<CreateSchema />} />
      <Route path="/schemas/:subjectName" element={<ViewSchema />} />
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
  );
};

export const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};
