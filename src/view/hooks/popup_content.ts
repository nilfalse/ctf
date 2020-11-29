import { useEffect, useState } from 'react';

import { TabDetails } from '../../background/repositories';
import * as xpc from '../../lib/xpc';

import { useQueryParams } from './query_params';

interface PopupContentInit {
  state: null;
}
interface PopupContentSuccess {
  state: 'success';
  details: TabDetails | null;
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

    xpc.dispatch('getTabDetails', tabId).then(
      (details) => {
        if (shouldIgnore) {
          return;
        }
        setResponse({
          details,
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
