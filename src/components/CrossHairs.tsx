import React, { memo } from 'react';

type CrossHairProps = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export const CrossHairs = memo((props: CrossHairProps): JSX.Element => {
  const { x, y, width, height } = props;
  const style = { pointerEvents: 'none', stroke: '#ccc' };

  return (
    <g>
      <line {...style} x1={0} y1={y} x2={width} y2={y} />
      <line {...style} x1={x} y1={0} x2={x} y2={height} />
    </g>
  );
});
