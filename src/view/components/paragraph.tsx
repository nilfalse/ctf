import * as React from 'react';

import './paragraph.css';

interface ParagraphProps {
  variant?: 'primary';
}

export const Paragraph: React.FC<ParagraphProps> = ({ variant, children }) => {
  const classNames = ['paragraph'];
  if (variant === 'primary') {
    classNames.push('primary');
  }

  return <p className={classNames.join(' ')}>{children}</p>;
};
