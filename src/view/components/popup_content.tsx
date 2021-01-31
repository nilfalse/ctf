import { hot } from 'react-hot-loader/root';
// eslint-disable-next-line import/order
import { FC } from 'react';

import { usePopupContent } from '../hooks/popup_content';

import { Empty } from './empty';
import { HeaderPrimary } from './header_primary';
import { Traceroute } from './traceroute';

export const _PopupContent: FC = () => {
  const popupResponse = usePopupContent();

  if (popupResponse.state === 'success' && popupResponse.report) {
    return (
      <>
        <HeaderPrimary report={popupResponse.report} />
        <Traceroute {...popupResponse.report} />
      </>
    );
  } else {
    return <Empty />;
  }
};

export const PopupContent = hot(_PopupContent);
