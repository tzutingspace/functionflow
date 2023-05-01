import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

export const joyrideStyles = {
  options: {
    primaryColor: '#1d2b6a', //修改背景色
    zIndex: 10000,
  },
};

export const Steps = [
  {
    title: 'Workflow Title',
    content: '給他一個獨特的workflow name',
    target: '#setting-workflow-name',
    placement: 'bottom',
    disableBeacon: true,
    hideBackButton: true,
  },
  {
    title: 'Trigger Type',
    content: '選擇 Trigger 的 type',
    target: '#input-content-0',
    placement: 'bottom',
    // disableBeacon: true,
    hideBackButton: true,
  },
  {
    title: 'Trigger Type',
    content: '填寫內容',
    target: '#input-content-0',
    placement: 'bottom',
    // disableBeacon: true,
    hideBackButton: true,
  },
  {
    title: 'Save Trigger',
    content: '針對你的trigger進行存檔',
    target: '#save-button-0',
    placement: 'bottom',
    hideBackButton: true,
  },
  {
    title: '新增job',
    content: '新增job',
    target: '#add-job-button-0',
    placement: 'bottom',
  },
  {
    title: '選擇你job',
    content: '填寫job內容',
    target: '#input-content-1',
    placement: 'bottom',
  },
  {
    title: '填寫job內容',
    content: '填寫job內容',
    target: '#input-content-1',
    placement: 'bottom',
  },
  {
    title: 'Save Trigger',
    content: '針對你的trigger進行存檔',
    target: '#save-button-1',
    placement: 'bottom',
    hideBackButton: true,
  },
  {
    title: '完成depoly',
    content: '完成整個',
    target: '#deploy-button',
    placement: 'bottom',
  },
];

// JoyrideCallbacks.js
export const handleJoyrideCallback = (data, joyrideState, setJoyrideState) => {
  const { action, index, type, status } = data;

  console.log('TYPE:', type, 'INDEX:', index, 'STATUS:', status, 'ACTION:', action);

  if (
    type === 'step:after' &&
    index === 1 &&
    (action === ACTIONS.CLOSE || action === ACTIONS.NEXT)
  ) {
    setJoyrideState({
      ...joyrideState,
      run: false,
      stepIndex: 1,
    });
  } else if (
    type === 'step:after' &&
    index === 4 &&
    (action === ACTIONS.CLOSE || action === ACTIONS.NEXT)
  ) {
    setJoyrideState({
      ...joyrideState,
      run: false,
      stepIndex: 4,
    });
  } else if (
    type === 'step:after' &&
    index === 5 &&
    (action === ACTIONS.CLOSE || action === ACTIONS.NEXT)
  ) {
    setJoyrideState({
      ...joyrideState,
      run: false,
      stepIndex: 5,
    });
  } else if (type === 'step:after' && (action === ACTIONS.CLOSE || action === ACTIONS.NEXT)) {
    setJoyrideState((prev) => {
      prev.stepIndex = prev.stepIndex + 1;
      return { ...prev };
    });
  }
  if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
    // 導覽結束
    setJoyrideState({
      ...joyrideState,
      run: false,
    });
    localStorage.setItem('isTourTaken', true);
  }
};
