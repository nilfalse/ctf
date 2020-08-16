import { useEffect, useState } from 'react';

import { TabDetails } from '../../background/repo';
import * as xpc from '../../lib/xpc';

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

export function usePopupContent(tabId: string | null) {
  const [response, setResponse] = useState<PopupContent>({
    state: null,
  });

  useEffect(() => {
    let shouldIgnore = false;

    setResponse({ state: null });

    if (!tabId) {
      return;
    }

    xpc.dispatch('getTabDetails', parseInt(tabId)).then(
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
