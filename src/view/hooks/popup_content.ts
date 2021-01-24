import { useEffect, useState } from 'react';

import { Report } from '../../lib/report';
import * as xpc from '../../services/xpc/xpc_popup_service';

import { useQueryParams } from './query_params';

interface PopupContentInit {
  state: null;
}
interface PopupContentSuccess {
  state: 'success';
  report: Report | null;
}
interface PopupContentFailure {
  state: 'failure';
  error: chrome.runtime.LastError;
}

type PopupContent =
  | PopupContentInit
  | PopupContentSuccess
  | PopupContentFailure;

export function usePopupContent() {
  const [response, setResponse] = useState<PopupContent>({
    state: null,
  });

  const { tab } = useQueryParams();
  const tabId = typeof tab === 'string' ? parseInt(tab) : null;

  useEffect(() => {
    let shouldIgnore = false;

    setResponse({ state: null });

    if (!tabId) {
      return;
    }

    xpc.dispatch('fetchReport', tabId).then(
      (report) => {
        if (shouldIgnore) {
          return;
        }
        setResponse({
          report,
          state: 'success',
        });
      },
      (error) => {
        if (shouldIgnore) {
          return;
        }
        setResponse({
          state: 'failure',
          error,
        });
      }
    );

    return () => {
      shouldIgnore = true;
    };
  }, [tabId]);

  return response;
}
