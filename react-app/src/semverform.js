import React, {useState} from 'react';
import axios from "axios";

const SemverForm = () => {
    const [state, setState] = useState({});

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
        axios
            .post('http://127.0.0.1:3000/compare', {ver1: state.semver1, ver2: state.semver2})
            .then((response) => {
                setState(state => ({...state, submitted: true, precedence: response.data.precedence}));
            });
    }

    const handleInputChange = (event) => {
        event.persist();
        setState(state => ({...state, [event.target.name]: event.target.value}));
    }

    const renderResults = () => {
        if(state.precedence) {
            return <img src="checkmark.png" alt="Checkmark" className="App-results"></img>
        }
        else {
            return <img src="cross.png" alt="Cross" className="App-results"></img>
        }
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input name="semver1" value={state.semver1} type="text" onChange={handleInputChange} placeholder="Semver One"/>
                <input name="semver2" value={state.semver2} type="text" onChange={handleInputChange} placeholder="Semver Two"/>
                <input type="submit" value="Check" />
            </form>
            {state.submitted && renderResults()}
        </div>
    )

}
export default SemverForm;