import logo from './logo.svg';
import { Link } from 'react-router-dom';
import './App.css';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    window.addEventListener('scroll', () => {
      console.log('scroll')
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo text-red" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
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
