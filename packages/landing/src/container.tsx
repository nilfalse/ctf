import { FC } from 'react';

import './container.css';

interface ContainerProps {
  className?: string;
}

export const Container: FC<ContainerProps> = ({ className, children }) => {
  return (
    <div className={`container${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
};
