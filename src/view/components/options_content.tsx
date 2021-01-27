import { hot } from 'react-hot-loader/root';
// eslint-disable-next-line import/order
import { FC } from 'react';

import { Paragraph } from './typography';

export const _OptionsContent: FC = () => {
  return (
    <div className="options">
      <Paragraph size="l">Preferences</Paragraph>

      <Paragraph>There are currently no configurable preferences...</Paragraph>
    </div>
  );
};

export const OptionsContent = hot(_OptionsContent);
