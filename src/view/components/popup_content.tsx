import { hot } from 'react-hot-loader/root';
// eslint-disable-next-line import/order
import * as React from 'react';

import { usePopupContent } from '../hooks/popup_content';
import { useQueryParams } from '../hooks/query_params';

import { IPSection } from './ip_section';
import { ServerSoftwareSection } from './server_software_section';

export const _PopupContent: React.FC = ({ children }) => {
  const { tab } = useQueryParams();
  const popupResponse = usePopupContent(typeof tab === 'string' ? tab : null);

  let content = null;
  if (popupResponse.state === 'success' && popupResponse.details) {
    content = (
      <>
        <ServerSoftwareSection request={popupResponse.details.request} />
        <IPSection request={popupResponse.details.request} />
      </>
    );
  }

  return (
    <div>
      <h1>Hello World</h1>

      {content}
      {children}
    </div>
  );
};

export const PopupContent = hot(_PopupContent);
