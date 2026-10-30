export function onLoading(cb: (tabId: number, tab: string) => unknown) {
  function handleUpdated(
    tabId: number,
    change: { status?: string; url?: string },
    tab: { url?: string },
  ) {
    if (change.status !== 'loading') {
      return;
    }

    /*
     * - Chromium only ever sends change.url with loading.
     * - Firefox also sends it with complete, but only in two cases, and neither is needed in our extension:
     *   - Same-document navigations (pushState, replaceState, hash changes, back after pushState) don't reset the tab and can't change the origin.
     *   - Error pages (connection refused, DNS failure, blocked port) have no response. Skipping them leaves the default flag, which is arguably more correct than the origin's earlier report.
     * - One field per browser: wherever change.url exists, tab.url has the same value (all observed events in Chromium). So FEATURE_TAB_URL simply picks the field.
     * - Firefox's stale tab.url never gets used. It only appears in loading events without change.url, and with the flag off those are skipped.
     */
    const url = import.meta.env.FEATURE_TAB_URL ? tab.url : change.url;
    if (url) {
      return cb(tabId, url);
    }
  }

  return browser.tabs.onUpdated.addListener(handleUpdated);
}

export async function query() {
  const tabs = await browser.tabs.query({});

  type Tab = { id: number; url: string };
  return tabs.filter((t) => t.id && t.url) as ReadonlyArray<Tab>;
}

export /* @inline */ function onClosed(cb: (tabId: number) => unknown) {
  return browser.tabs.onRemoved.addListener(cb);
}
