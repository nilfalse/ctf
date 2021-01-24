import { Match } from '../../../interceptors';
import {
  CountryRequest,
  CountryRequestParams,
} from '../../../lib/country_request';
import * as popupContent from '../../../view/hooks/popup_content';

type HarnessContentParam =
  | popupContent.PopupContentInit
  | {
      state: 'success';
      request?: CountryRequestParams;
      matches: ReadonlyArray<Match>;
    }
  | popupContent.PopupContentFailure;

export function content(content: HarnessContentParam) {
  const spy = jest.spyOn(popupContent, 'usePopupContent');
  let mockedContent: popupContent.PopupContent;

  if (content.state === 'success') {
    const request = content.request
      ? new CountryRequest(content.request)
      : null;
    const details = request
      ? {
          request,
          matches: content.matches,
        }
      : null;

    mockedContent = { ...content, details } as const;
  } else {
    mockedContent = content;
  }

  beforeEach(function () {
    spy.mockReturnValue(mockedContent);
  });

  afterEach(function () {
    spy.mockReset();
  });

  return spy;
}
