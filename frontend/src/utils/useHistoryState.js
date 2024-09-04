import { useState, useCallback } from "react";

const useHistoryState = (initialState) => {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateState = useCallback(
    (newState) => {
      const updatedHistory = history.slice(0, currentIndex + 1);
      updatedHistory.push(newState);
      setHistory(updatedHistory);
      setCurrentIndex(updatedHistory.length - 1);
      setState(newState);
    },
    [history, currentIndex]
  );

  const setLayout = useCallback(
    (newStateOrFunction) => {
      setState((prevState) => {
        const newState = typeof newStateOrFunction === "function" ? newStateOrFunction(prevState) : newStateOrFunction;
        updateState(newState);
        return newState;
      });
    },
    [updateState]
  );

  const undo = useCallback(() => {
    if (currentIndex > 1) {
      setCurrentIndex(currentIndex - 1);
      setState(history[currentIndex - 1]);
    }
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setState(history[currentIndex + 1]);
    }
  }, [currentIndex, history]);

  return [state, setLayout, undo, redo];
};

export default useHistoryState;
