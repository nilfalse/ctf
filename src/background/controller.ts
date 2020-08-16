import { CountryResponseCommand } from '../commands/country_response';
import { InitTabCloseListenerCommand } from '../commands/init_tab_close_listener';
import { InitWebRequestListenerCommand } from '../commands/init_webrequest_listener';
import { InitXPCDispatcherCommand } from '../commands/init_xpc_dispatcher';
import { UpdatePopupButtonCommand } from '../commands/update_popup_button';
import { UpdateTabDetailsCommand } from '../commands/update_tab_details';
import * as app from './app';

export function init({ browser }: { browser: typeof chrome }) {
  app.subscribe(CountryResponseCommand, async function (
    { tabId, request },
    matches
  ) {
    app.publish(
      new UpdateTabDetailsCommand(tabId, {
        request,
        matches,
      })
    );
    app.publish(new UpdatePopupButtonCommand(tabId, matches));
  });

  app.publish(new InitXPCDispatcherCommand());
  app.publish(new InitTabCloseListenerCommand());
  app.publish(new InitWebRequestListenerCommand());
}
