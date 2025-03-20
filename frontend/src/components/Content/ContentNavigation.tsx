import React from 'react';

const ContentNavigation = ({ currentFrame, totalFrames }) => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-2">
    <h4 className="mb-4 text-sm font-semibold">Progress</h4>
    <span className="mb-4 text-sm">{Math.round(((currentFrame + 1) / totalFrames) * 100)}%</span>
    <div className="relative h-full w-4 rounded-xl bg-gray-300">
      <div
        className="absolute w-full rounded-xl bg-black"
        style={{ height: `${((currentFrame + 1) / totalFrames) * 100}%` }}
      />
    </div>
  </div>
);

export default ContentNavigation;