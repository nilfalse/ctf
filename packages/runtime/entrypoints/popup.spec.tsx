import * as harness from '../__test__/harness';
import * as debug from '../util/debug';
import * as view from '../view';
import { CloudflareTrace } from '../view/components/traceroute/cloudflare';
import { CloudFrontTrace } from '../view/components/traceroute/cloudfront';
import { FastlyTrace } from '../view/components/traceroute/fastly';
import { IPTrace } from '../view/components/traceroute/ip';

describe('Popup', () => {
  describe('when initializing', () => {
    let startSpy: jest.SpyInstance;

    beforeEach(() => {
      startSpy = jest.spyOn(view, 'start').mockResolvedValue();
    });

    afterEach(() => {
      startSpy.mockRestore();
    });

    it('should print the debug introduction', () => {
      const debugSpy = jest.spyOn(debug, 'intro');

      void jest.requireActual('./popup');

      expect(debugSpy).toHaveBeenCalledTimes(1);
      expect(startSpy).toHaveBeenCalledTimes(1);

      debugSpy.mockRestore();
    });
  });

  describe('when rendering', () => {
    harness.browser.i18n();
    harness.browser.storage();

    beforeEach(() =>
      jest
        .requireActual<{
          start: () => Promise<unknown>;
        }>('../view')
        .start()
    );

    describe('for a Switzerland-based website', () => {
      harness.xpc.popup(import('../__test__/fixtures/success_ip-ch'));
      const ref = harness.popup.render();

      it('should render IP country info', () => {
        const iptrace = ref.popup.find(IPTrace);

        expect(iptrace.text()).toContain('Switzerland');
        expect(iptrace.children()).toMatchSnapshot();
      });
    });

    describe('for a Netherlands-based website with legal entity in the US', () => {
      harness.xpc.popup(import('../__test__/fixtures/success_ip-nl-us'));
      const ref = harness.popup.render();

      it('should render IP country info', () => {
        const iptrace = ref.popup.find(IPTrace);

        expect(iptrace.text()).toContain('Netherlands');
        expect(iptrace.text()).toContain('United States of America');
        expect(iptrace.children()).toMatchSnapshot();
      });
    });

    describe('for a Cloudflare-protected website', () => {
      harness.xpc.popup(import('../__test__/fixtures/success_cloudflare-cph'));
      const ref = harness.popup.render();

      it('should render country info for Cloudflare IP', () => {
        const iptrace = ref.popup.find(IPTrace);

        expect(iptrace.text()).toContain('United States of America');
        expect(iptrace.children()).toMatchSnapshot();
      });

      it('should show Cloudflare data center abbreviation', () => {
        const cloudflareTrace = ref.popup.find(CloudflareTrace).children();

        expect(cloudflareTrace.text()).toContain('Denmark');
        expect(cloudflareTrace.text()).toContain('CPH');
        expect(cloudflareTrace).toMatchSnapshot();
      });
    });

    describe('for a website behind Cloudflare with Powered By info exposed', () => {
      harness.xpc.popup(
        import('../__test__/fixtures/success_cloudflare_poweredby')
      );
      const ref = harness.popup.render();

      it('should render country info for Cloudflare IP', () => {
        const iptrace = ref.popup.find(IPTrace);

        expect(iptrace.text()).toContain('United States of America');
        expect(iptrace.children()).toMatchSnapshot();
      });

      it('should render the header value to the user', () => {
        const iptrace = ref.popup.find(IPTrace).children();

        expect(iptrace.text()).toContain('Powered By:');
        expect(iptrace.text()).toContain('WP Engine');
        expect(iptrace).toMatchSnapshot();
      });

      it('should show Cloudflare data center abbreviation', () => {
        const cloudflareTrace = ref.popup.find(CloudflareTrace).children();

        expect(cloudflareTrace.text()).toContain('Germany');
        expect(cloudflareTrace.text()).toContain('FRA');
        expect(cloudflareTrace).toMatchSnapshot();
      });
    });

    describe('for a CloudFront-enabled website', () => {
      harness.xpc.popup(import('../__test__/fixtures/success_cloudfront-fra'));
      const ref = harness.popup.render();

      it('should render country info for CloudFront Edge IP', () => {
        const iptrace = ref.popup.find(IPTrace);

        expect(iptrace.text()).toContain('United States of America');
        expect(iptrace.children()).toMatchSnapshot();
      });

      it('should show CloudFront POP abbreviation', () => {
        const cloudfrontTrace = ref.popup.find(CloudFrontTrace).children();

        expect(cloudfrontTrace.text()).toContain('Germany');
        expect(cloudfrontTrace.text()).toContain('FRA');
        expect(cloudfrontTrace).toMatchSnapshot();
      });
    });

    describe('for a Fastly-accelerated website', () => {
      harness.xpc.popup(import('../__test__/fixtures/success_fastly-cph'));
      const ref = harness.popup.render();

      it('should render country info for Fastly node IP', () => {
        const iptrace = ref.popup.find(IPTrace);

        expect(iptrace.text()).toContain('United States of America');
        expect(iptrace.children()).toMatchSnapshot();
      });

      it('should show Fastly POP abbreviation', () => {
        const fastlyTrace = ref.popup.find(FastlyTrace).children();

        expect(fastlyTrace.text()).toContain('Denmark');
        expect(fastlyTrace.text()).toContain('CPH');
        expect(fastlyTrace).toMatchSnapshot();
      });
    });
  });
});
