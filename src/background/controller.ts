import { CountryResponseCommand } from '../commands/country_response';
import { InitCommand } from '../commands/init';
import { UpdatePopupButtonCommand } from '../commands/update_popup_button';
import { UpdateTabDetailsCommand } from '../commands/update_tab_details';

import * as app from './app';

export function init() {
  app.subscribe(CountryResponseCommand, function ({ tabId, request }, matches) {
    app.publish(
      new UpdateTabDetailsCommand(tabId, {
        request,
        matches,
      })
    );
    app.publish(new UpdatePopupButtonCommand(tabId, matches));
  });

  app.publish(new InitCommand());
}
