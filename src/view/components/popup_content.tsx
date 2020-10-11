import { hot } from 'react-hot-loader/root';
// eslint-disable-next-line import/order
import * as React from 'react';

import { usePopupContent } from '../hooks/popup_content';

import { Empty } from './empty';
import { HeaderPrimary } from './header_primary';
import { Traceroute } from './traceroute';

export const _PopupContent: React.FC = () => {
  const popupResponse = usePopupContent();

  if (popupResponse.state === 'success' && popupResponse.details) {
    return (
      <>
        <HeaderPrimary {...popupResponse.details} />
        <Traceroute {...popupResponse.details} />
      </>
    );
  } else {
    return <Empty />;
  }
};

export const PopupContent = hot(_PopupContent);
