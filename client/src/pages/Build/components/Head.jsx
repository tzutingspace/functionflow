import { useEffect, useState } from 'react';
import styled from 'styled-components';

const HeadInput = styled.input``;

const Head = ({ workflowTitle, setWorkflowTitle }) => {
  return (
    <>
      <label>WorkFlow Name：</label>
      <HeadInput
        onChange={(e) => setWorkflowTitle(e.target.value)}
        placeholder="請輸入WorkFlow 名稱"
        value={workflowTitle}
      ></HeadInput>
      <button type="button">Deploy</button>
      <br />
      <div>----------------------------------------------------</div>
    </>
  );
};

export default Head;
