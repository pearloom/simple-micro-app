import logo from "./logo.svg";
import { Link } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [parentData, setParentData] = useState('')

  useEffect(() => {
    // 数据监听
    window.microApp?.addDataListener((data) => {
      console.log("接受数据：", data);
      setParentData(data.name)
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo text-red" alt="logo" />
        <p>
          {parentData}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Link className="App-link" to="/pageA">
          Go to PageA
        </Link>
      </header>
    </div>
  );
}

export default App;
