import React from 'react';

import { IItem, Wheel } from './Wheel';

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
  const [result, setResult] = React.useState<undefined | IItem>();

  const getSemirandomIndex = React.useCallback(() => {
    let index = targetIndex;
    while (index == targetIndex) {
      index = getRandomIndex();
    }
    return index;
  }, [targetIndex]);

  function prepForSpin() {
    setResult(undefined);
    setTargetIndex(getSemirandomIndex());
    setCurrentDegrees((currentDegrees + targetDegrees) % 360);

    const numEntries = testItems.length;
    const wedgeDegrees = 360 / numEntries;
    const currentIndex = currentDegrees % wedgeDegrees;
    console.log(currentDegrees);

    setTargetDegrees(
      MIN_NUM_SPINS * 360 + Math.abs(targetIndex - currentIndex) * wedgeDegrees,
    );
  }
  function handleSpin() {
    switch (state) {
      // Remember that these are transitioning *from* this state, not to it.
      case AppState.READY:
      case AppState.RESULTS:
        prepForSpin();
        setState(AppState.SPINNING);
        break;
      case AppState.SPINNING:
        setState(AppState.READY);
        break;
    }
  }

  const handleSpinComplete = React.useCallback(() => {
    setTargetDegrees(targetDegrees % 360);
    setCurrentDegrees(currentDegrees % 360);
    setState(AppState.RESULTS);
    setResult(testItems[targetIndex]);
  }, [currentDegrees, targetDegrees, targetIndex]);

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
      <div className="button-container center-contents">
        <button onClick={handleSpin} className="cream">
          {state === AppState.SPINNING ? 'Brewing...' : 'Spin'}
        </button>
      </div>
      {result && <div id="result">{`You matched with ${result?.label}!`}</div>}
      AppState: {state}
    </div>
  );
}

export default App;
