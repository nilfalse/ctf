import * as React from 'react';

import './typography.css';

interface TypographyProps {
  variant?: 'mono' | 'light' | 'handwriting';
  size?: 'l' | 's' | 'xs';
  className?: string | ReadonlyArray<string>;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  size,
  className,
  children,
}) => {
  let classNames = ['typography'];
  if (variant) {
    classNames.push('typography_' + variant);
  }
  if (size) {
    classNames.push('typography_' + size);
  }
  if (className) {
    classNames = classNames.concat(className);
  }

  return <p className={classNames.join(' ')}>{children}</p>;
};
