import React, { useState } from 'react';
import Home from './components/home';

function App() {
    const [selectedItems, setSelectedItems] = useState([]);

    return (
 
        <Home />
    );
}

export default App;
