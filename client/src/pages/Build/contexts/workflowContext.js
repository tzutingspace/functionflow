import { createContext, useEffect, useState } from 'react';

export const WorkflowStateContext = createContext({
  isDraft: true,
  isJobsSave: [],
  setIsJobsSave: () => {},
  setIsDraft: () => {},
});

export const WorkflowStateProvider = ({ children }) => {
  const [isDraft, _setIsDraft] = useState(true);
  const [isJobsSave, _setIsJobsSave] = useState([]);

  const setIsDraft = (status) => {
    _setIsDraft(status);
    console.log('改變狀態...in Context');
  };

  const setIsJobsSave = (status, idx) => {
    _setIsJobsSave((prev) => {
      console.log('呼叫函示', prev, idx);
      return [...prev.slice(0, idx + 1), ...status, ...prev.slice(idx + 1)];
    });
    console.log('改變狀態...in Context2');
    console.log('isJobsSave', isJobsSave);
  };

  return (
    <WorkflowStateContext.Provider value={{ isDraft, setIsDraft, isJobsSave, setIsJobsSave }}>
      {children}
    </WorkflowStateContext.Provider>
  );
};
