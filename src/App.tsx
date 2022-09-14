import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
// import Header from "./components/headerComponent";
import Home from "./pages/home";
import LearningPage from "../pages/learning";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grammar" element={<LearningPage />} />
          <Route path="*" element={<Home />} />
        </Routes> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
