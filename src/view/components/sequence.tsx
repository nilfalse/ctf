import * as React from 'react';

import './sequence.css';

interface SequenceItemProps {
  isActive?: boolean;
}

export const SequenceItem: React.FC<SequenceItemProps> = ({
  isActive,
  children,
}) => {
  const classNames = ['sequence__item'];
  if (isActive) {
    classNames.push('sequence__active');
  }

  return <li className={classNames.join(' ')}>{children}</li>;
};

export const Sequence: React.FC = ({ children }) => {
  return (
    <ul className="sequence sequence_animate sequence_success">{children}</ul>
  );
};
