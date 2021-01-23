import { CountryReplyCommand } from '../commands/country_reply';
import { InitCommand } from '../commands/init';
import { UpdatePopupButtonCommand } from '../commands/update_popup_button';
import { UpdateTabDetailsCommand } from '../commands/update_tab_details';
import * as mediator from '../util/mediator';

export function start() {
  mediator.subscribe(
    CountryReplyCommand,
    function ({ tabId, request }, country) {
      mediator.publish(
        new UpdateTabDetailsCommand(tabId, {
          request,
          matches: country.traceroute,
        })
      );
      mediator.publish(new UpdatePopupButtonCommand(tabId, country));
    }
  );

  mediator.publish(new InitCommand());
}
