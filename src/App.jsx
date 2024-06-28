// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Visualize_filteration from "./components/visualize/ForceGraph3D";
import ForceGraph2DComponent from "./components/ForceGraph2d";
import Sidebar from "./components/Buttons/SIdeBar";
import MainContent from "./components/Maincontent/Maincontent";
import './App.css'
const App = () => {
  return (
    <Router>

      <div className="App">

{/* 
        <Sidebar className="App-header">

             <Sidebar/>
        </Sidebar> */}

        <main>
          <div>
            <div>
              <Routes>
                
              <Route path="/" element={<MainContent />} />
                <Route path="/visualize" element={<Visualize_filteration />} />
                <Route path="/CONFIGURATION" element={<ForceGraph2DComponent />} />
                <Route path="/main" element={<MainContent />} />

              </Routes>


            </div>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
