import  { ACTIONS, STATUS } from 'react-joyride';

export const joyrideStyles = {
  options: {
    primaryColor: '#1d2b6a', //修改背景色
    zIndex: 10000,
  },
};

export const Steps = [
  {
    title: 'Workflow Name',
    content: 'Please enter the name you want for your workflow.',
    target: '#setting-workflow-name',
    placement: 'bottom',
    disableBeacon: true,
    hideBackButton: true,
  },
  {
    title: 'Trigger Type',
    content: 'Please choose the trigger mechanism you want.',
    target: '#input-content-0',
    placement: 'bottom',
    // disableBeacon: true,
    hideBackButton: true,
  },
  {
    title: 'Trigger Content',
    content: 'Please provide detailed content.',
    target: '#input-content-0',
    placement: 'bottom',
    // disableBeacon: true,
    hideBackButton: true,
  },
  {
    title: 'Save Trigger',
    content: 'Save based on your settings.',
    target: '#save-button-0',
    placement: 'bottom',
    hideBackButton: true,
  },
  {
    title: 'Add a new job',
    content: 'Add a new job',
    target: '#add-job-button-0',
    placement: 'bottom',
    hideBackButton: true,
  },
  {
    title: 'Job Function',
    content: 'Choose the job function you want.',
    target: '#input-content-1',
    placement: 'bottom',
    hideBackButton: true,
  },
  {
    title: 'Job Function Content',
    content: 'Please provide detailed content.',
    target: '#input-content-1',
    placement: 'bottom',
    hideBackButton: true,
  },
  {
    title: 'Save Job Content',
    content: 'Save based on your settings.',
    target: '#save-button-1',
    placement: 'bottom',
    hideBackButton: true,
  },
  {
    title: 'Deploy',
    content: 'Once you have finished setting up your workflow, please deploy it.',
    target: '#deploy-button',
    placement: 'bottom',
    hideBackButton: true,
  },
];

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

export const AddSteps = [
  {
    title: 'Add Workflow',
    content: 'Create your first Workflow.',
    target: '#add-workflow',
    placement: 'bottom',
    disableBeacon: true,
    hideBackButton: true,
  },
];

export const handleJoyrideCallbackAdd = (data, joyrideState, setJoyrideState) => {
  const { action, index, type, status } = data;

  console.log('TYPE:', type, 'INDEX:', index, 'STATUS:', status, 'ACTION:', action);

  if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
    // 導覽結束
    setJoyrideState({
      ...joyrideState,
      run: false,
    });
    localStorage.setItem('isTourTakenAdd', true);
  }
};
