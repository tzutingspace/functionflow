import { useState } from 'react';

const Head = () => {
  const [workflowTitle, setWorkflowTitle] = useState();

  return (
    <>
      <div>
        <label>WorkFlow 名稱：</label>
        <input id="Workflow" type="text"></input>
      </div>
      <br />
    </>
  );
};

export default Head;
