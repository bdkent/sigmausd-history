import React, { memo } from 'react';

export const ForkMe = memo(() => {
  return (
    <a
      className="github-fork-ribbon"
      href="https://github.com/bdkent/sigmausd-history"
      data-ribbon="Fork me on GitHub"
      title="Fork me on GitHub"
      target="_blank"
      rel="noreferrer"
    >
      Fork me on GitHub
    </a>
  );
});
