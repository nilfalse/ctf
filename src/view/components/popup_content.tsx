import { hot } from 'react-hot-loader/root';
// eslint-disable-next-line import/order
import * as React from 'react';

import { usePopupContent } from '../hooks/popup_content';
import { useQueryParams } from '../hooks/query_params';

import { HeaderSection } from './header_section';
import { ServerSection } from './server_section';

export const _PopupContent: React.FC = ({ children }) => {
  const { tab } = useQueryParams();
  const popupResponse = usePopupContent(typeof tab === 'string' ? tab : null);

  let content = null;
  if (popupResponse.state === 'success' && popupResponse.details) {
    content = (
      <>
        <HeaderSection matches={popupResponse.details.matches} />
        <ServerSection request={popupResponse.details.request} />
      </>
    );
  }

  return (
    <div>
      {content}
      {children}
    </div>
  );
};

export const PopupContent = hot(_PopupContent);
