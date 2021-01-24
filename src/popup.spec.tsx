import { mount, ReactWrapper } from 'enzyme';

import * as successCloudflareCPH from './__test__/fixtures/success_cloudflare-cph';
import * as successCloudflarePoweredBy from './__test__/fixtures/success_cloudflare_poweredby';
import * as successIPSwitzerland from './__test__/fixtures/success_ip-ch';
import * as successIPNetherlandsUS from './__test__/fixtures/success_ip-nl-us';
import * as harness from './__test__/harness';
import { PopupContent } from './view/components/popup_content';
import { CloudflareTrace } from './view/components/traceroute/cloudflare';
import { IPTrace } from './view/components/traceroute/ip';

describe('Popup', () => {
  harness.browser.i18n();

  describe('for a Switzerland-based website', () => {
    let popup: ReactWrapper;

    harness.xpc.popup(successIPSwitzerland);

    beforeEach(async () => {
      popup = mount(<PopupContent />);

      return harness.popup.render.popupDependencies(popup);
    });

    afterEach(() => {
      popup.unmount();
    });

    it('should render IP country info', () => {
      const iptrace = popup.find(IPTrace);

      expect(iptrace.text()).toContain('Switzerland');
      expect(iptrace.children()).toMatchSnapshot();
    });
  });

  describe('for a Netherlands-based website with legal entity in the US', () => {
    let popup: ReactWrapper;

    harness.xpc.popup(successIPNetherlandsUS);

    beforeEach(async () => {
      popup = mount(<PopupContent />);

      return harness.popup.render.popupDependencies(popup);
    });

    afterEach(() => {
      popup.unmount();
    });

    it('should render IP country info', () => {
      const iptrace = popup.find(IPTrace);

      expect(iptrace.text()).toContain('Netherlands');
      expect(iptrace.text()).toContain('United States of America');
      expect(iptrace.children()).toMatchSnapshot();
    });
  });

  describe('for a Cloudflare-protected website', () => {
    let popup: ReactWrapper;

    harness.xpc.popup(successCloudflareCPH);

    beforeEach(async () => {
      popup = mount(<PopupContent />);

      return harness.popup.render.popupDependencies(popup);
    });

    afterEach(() => {
      popup.unmount();
    });

    it('should render country info for Cloudflare IP', () => {
      const iptrace = popup.find(IPTrace);

      expect(iptrace.text()).toContain('United States of America');
      expect(iptrace.children()).toMatchSnapshot();
    });

    it('should show Cloudflare data center abbreviation', () => {
      const cloudflareTrace = popup.find(CloudflareTrace).children();

      expect(cloudflareTrace.text()).toContain('Denmark');
      expect(cloudflareTrace.text()).toContain('CPH');
      expect(cloudflareTrace).toMatchSnapshot();
    });
  });

  describe('for a website behind Cloudflare with Powered By info exposed', () => {
    let popup: ReactWrapper;

    harness.xpc.popup(successCloudflarePoweredBy);

    beforeEach(async () => {
      popup = mount(<PopupContent />);

      return harness.popup.render.popupDependencies(popup);
    });

    afterEach(() => {
      popup.unmount();
    });

    it('should render country info for Cloudflare IP', () => {
      const iptrace = popup.find(IPTrace);

      expect(iptrace.text()).toContain('United States of America');
      expect(iptrace.children()).toMatchSnapshot();
    });

    it('should render the header value to the user', () => {
      const iptrace = popup.find(IPTrace).children();

      expect(iptrace.text()).toContain('Powered By:');
      expect(iptrace.text()).toContain('WP Engine');
      expect(iptrace).toMatchSnapshot();
    });

    it('should show Cloudflare data center abbreviation', () => {
      const cloudflareTrace = popup.find(CloudflareTrace).children();

      expect(cloudflareTrace.text()).toContain('Germany');
      expect(cloudflareTrace.text()).toContain('FRA');
      expect(cloudflareTrace).toMatchSnapshot();
    });
  });
});
