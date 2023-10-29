import React from 'react';

import { Wheel } from './Wheel';

import './App.scss';

const testItems = [
  { label: 'Alice', id: 1 },
  { label: 'Bob', id: 2 },
  { label: 'Charlie', id: 3 },
];

enum AppState {
  READY,
  SPINNING,
  RESULTS,
}

function getRandomIndex() {
  return Math.floor(Math.random() * testItems.length);
}
const MIN_NUM_SPINS = 5;

function App() {
  const [state, setState] = React.useState(AppState.READY);
  const [targetIndex, setTargetIndex] = React.useState(getRandomIndex());
  const [currentDegrees, setCurrentDegrees] = React.useState(0);
  const [targetDegrees, setTargetDegrees] = React.useState(0);

  const getSemirandomIndex = React.useCallback(() => {
    let index = targetIndex;
    while (index == targetIndex) {
      index = getRandomIndex();
    }
    return index;
  }, [targetIndex]);

  function handleSpin() {
    switch (state) {
      case AppState.READY:
        setTargetIndex(getSemirandomIndex());
        setCurrentDegrees((currentDegrees + targetDegrees) % 360);
        setTargetDegrees(
          MIN_NUM_SPINS * 360 + targetIndex * (360 / testItems.length),
        );
        setState(AppState.SPINNING);
        break;
      case AppState.SPINNING:
        setState(AppState.READY);
        break;
    }
  }

  const handleSpinComplete = React.useCallback(() => {
    setTargetDegrees(targetDegrees % 360);
    setState(AppState.READY);
  }, [targetDegrees]);

  return (
    <div className="App">
      <div className="wheel-container center-contents">
        <Wheel
          items={testItems}
          targetDegrees={currentDegrees + targetDegrees}
          animateTransition={state === AppState.SPINNING}
          onComplete={handleSpinComplete}
        />
      </div>
      <div style={{ color: 'white' }}>
        App state: {state}
        <br />
        Current degrees:{currentDegrees}
        <br />
        Target index: {targetIndex}
        <br />
        Target degrees: {targetDegrees}
      </div>

      <div className="button-container center-contents">
        <button onClick={handleSpin} className="cream">
          {state === AppState.SPINNING ? 'Brewing...' : 'Spin'}
        </button>
      </div>
    </div>
  );
}

export default App;
