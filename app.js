const { useState, useEffect } = React;

function App() {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        fetch("timer.js")
            .then(response => response.text())
            .then(script => {
                eval(script); // Load nodes from timer.js
                if (typeof nodeData !== "undefined") {
                    setNodes(nodeData);
                }
            });
    }, []);

    return (
        <div>
            <h1>FFXIV Gathering Nodes</h1>
            <ul>
                {nodes.map((node, index) => (
                    <li key={index}>
                        <strong>{node.name}</strong> - {node.location} ({node.aetheryte}) - {node.type}
                    </li>
                ))}
            </ul>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
