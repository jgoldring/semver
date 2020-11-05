import './App.css';
import SemverForm from './semverform';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Semver Precedence Check </h1>
                <h2>By Jamie Goldring </h2>
                <p>A simple Nodejs/Express/React App to check if the first semver has precedence over the second</p>
                <a href="https://semver.org/spec/v2.0.0.html">Semantic Versioning 2.0.0</a>
                <SemverForm />
            </header>
        </div>
    );
}

export default App;
