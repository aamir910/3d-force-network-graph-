// src/App.jsx
import React from 'react';
import ForceGraph3DComponent from './components/ForceGraph3D';

import ForceGraph2DComponent from './components/ForceGraph2d';

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                {/* <h1>3D Force Graph with React</h1> */}
            </header>
            <main>
            <div>
            {/* <h1>3D Graph</h1>
            <ForceGraph3DComponent /> */}
            <h1>2D Graph</h1>
            <ForceGraph2DComponent />
        </div>
            </main>
        </div>
    );
};

export default App;
