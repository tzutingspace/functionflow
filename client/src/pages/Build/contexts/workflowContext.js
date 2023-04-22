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

  const setIsJobsSave = (status, jobData) => {
    console.log('有被執行嗎？');
    _setIsJobsSave((prev) => {
      console.log('呼叫函示', prev);
      const index = prev.findIndex((item) => item.uuid === jobData.uuid);
      if (index !== -1) {
        return [...prev.slice(0, index + 1), status, ...prev.slice(index + 1)];
      }
      return [...prev, status];
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
