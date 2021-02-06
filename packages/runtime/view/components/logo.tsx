import { FC } from 'react';

interface LogoProps {
  className?: string;
  color?: 'default' | 'light';
  width?: number;
  height?: number;
}

export const Logo: FC<LogoProps> = ({
  color = 'default',
  width,
  height,
  className,
}) => {
  const fill = color === 'default' ? '#00bbff' : '#fff';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width={width}
      height={height}
      className={className}
    >
      <path
        d="M560 300L560 116L120 116L292 640L72 300L0 55L640 55L640 361L308 361L282 300L560 301L560 300Z"
        fill={fill}
      />
    </svg>
  );
};
