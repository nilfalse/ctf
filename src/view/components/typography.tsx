import * as React from 'react';

import './typography.css';

interface TypographyProps {
  variant?: 'primary';
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
}) => {
  const classNames = ['typography'];
  if (variant === 'primary') {
    classNames.push('typography_primary');
  }

  return <p className={classNames.join(' ')}>{children}</p>;
};
