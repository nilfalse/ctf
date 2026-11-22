const ALARM_FREQUENCIES = {
  WEEKLY: 7 * 24 * 60,
} as const;

type Frequency = keyof typeof ALARM_FREQUENCIES;

export async function alarm(name: string, frequency: Frequency) {
  if (await browser.alarms.get(name)) {
    return;
  }

  const periodInMinutes = ALARM_FREQUENCIES[frequency];
  await browser.alarms.create(name, {
    delayInMinutes: periodInMinutes,
    periodInMinutes,
  });
}

export /* @inline */ function onAlarm(name: string, cb: () => unknown) {
  return browser.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === name) {
      return cb();
    }
  });
}
