// src/App.jsx
import React from 'react';
import ForceGraph3DComponent from './components/ForceGraph3D';

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                {/* <h1>3D Force Graph with React</h1> */}
            </header>
            <main>
                <ForceGraph3DComponent />
            </main>
        </div>
    );
};

export default App;
