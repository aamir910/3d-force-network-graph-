// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ForceGraph3DComponent from "./components/ForceGraph3D";
import ForceGraph2DComponent from "./components/ForceGraph2d";
import Sidebar from "./components/Buttons/SIdeBar";
import MainContent from "./components/Maincontent/Maincontent";
import './App.css'
const App = () => {
  return (
    <Router>
      <div className="App">
        <Sidebar className="App-header">

             <Sidebar/>
        </Sidebar>

        <main>
          <div>
            <div>
              <Routes>
                <Route path="/visualize" element={<ForceGraph2DComponent />} />
                <Route path="/upload" element={<MainContent/>} />

                

                {/* Add more routes as needed */}
              </Routes>

              {/* <ForceGraph2DComponent /> */}
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
