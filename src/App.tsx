import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import Students from "./pages/Students";
import Settings from "./pages/Settings";
import QuizCreator from "./components/QuizCreator";
import SplashScreen from "./components/SplashScreen";
import { useState } from "react";

function App() {
  // Hardcode userRole as faculty to see all components
  const userRole = "faculty";
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Router>
        <Layout userRole={userRole}>
          <Routes>
            {/* Common routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />

            {/* Faculty-only routes */}
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/students" element={<Students />} />
            <Route path="/create-quiz" element={<QuizCreator />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
