import React from 'react';
import KeyboardLock from '@/components/proctoring-components/KeyboardLock';
import RightClickDisabler from '@/components/proctoring-components/RightClickDisable';

const ProctoringWrapper = ({ children }) => (
  <>
    <KeyboardLock />
    <RightClickDisabler />
    {children}
  </>
);

export default ProctoringWrapper;