import * as React from 'react';

import './sequence.css';

interface SequenceProps {
  items: ReadonlyArray<React.ReactElement>;
}

export const Sequence: React.FC<SequenceProps> = ({ items }) => {
  return (
    <ul className="sequence sequence_animate sequence_success">
      {items.map(function (child, idx) {
        const classNames = ['sequence__item'];
        if (idx === 0) {
          classNames.push('sequence__active');
        }

        return <li className={classNames.join(' ')}>{child}</li>;
      })}
    </ul>
  );
};
