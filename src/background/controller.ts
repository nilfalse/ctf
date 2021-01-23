import { CountryReplyCommand } from '../commands/country_reply';
import { InitCommand } from '../commands/init';
import { UpdatePopupButtonCommand } from '../commands/update_popup_button';
import { UpdateTabDetailsCommand } from '../commands/update_tab_details';

import * as app from './app';

export function start() {
  app.subscribe(CountryReplyCommand, function ({ tabId, request }, country) {
    app.publish(
      new UpdateTabDetailsCommand(tabId, {
        request,
        matches: country.traceroute,
      })
    );
    app.publish(new UpdatePopupButtonCommand(tabId, country));
  });

  app.publish(new InitCommand());
}
