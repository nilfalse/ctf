import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { useQueryParams } from '../hooks/query_params';

export const _PopupContent: React.FC = ({ children }) => {
  const { tab } = useQueryParams();

  return (
    <div>
      <h1>Hello World</h1>

      {children}
    </div>
  );
};

export const PopupContent = hot(_PopupContent);
