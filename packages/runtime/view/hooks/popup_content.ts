import { useEffect, useState } from 'react';

import { Report } from '../../lib/report';
import * as xpc from '../../services/xpc/xpc_popup_service';
import * as debug from '../../util/debug';

import { useQueryParams } from './query_params';

interface PopupContentInit {
  state: null;
}
interface PopupContentSuccess {
  state: 'success';
  report: Report;
}
interface PopupContentFailure {
  state: 'failure';
  error: Error;
}

type PopupContent =
  | PopupContentInit
  | PopupContentSuccess
  | PopupContentFailure;

export function usePopupContent() {
  const [response, setResponse] = useState<PopupContent>({
    state: null,
  });

  const TAG = location.search;

  const { tab } = useQueryParams();
  const tabId = typeof tab === 'string' ? parseInt(tab) : null;

  useEffect(() => {
    let shouldIgnore = false;

    debug.log(`Popup${TAG}: Fetching report`);

    if (!tabId) {
      return;
    }

    xpc.dispatch('fetchReport', tabId).then(
      (report) => {
        debug.log(`Popup${TAG}: Report has been fetched`, report);

        if (shouldIgnore) {
          return;
        }

        if (report) {
          setResponse({
            report,
            state: 'success',
          });
        } // FIXME else throw a "Not Found"
      },
      (error: Error) => {
        debug.error(error);

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
