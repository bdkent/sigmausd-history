import React, { memo } from 'react';
import LoadingBar from 'react-top-loading-bar';

type ProgressBarProps = {
  progress: number;
  dayCount: number;
  onComplete: () => void;
};

export const ProgressBar = memo((props: ProgressBarProps) => {
  const { progress, dayCount, onComplete } = props;

  return (
    <LoadingBar
      color="#f11946"
      progress={((dayCount - progress) / dayCount) * 100}
      onLoaderFinished={onComplete}
    />
  );
});
