const header =
  '"type","continent","iso_country","iso_region","iata_code"' + '\n';

const airportsByIATA = {
  cph: '"large_airport","EU","DK","DK-84","CPH"',
  iev: '"medium_airport","EU","UA","UA-32","IEV"',
  kbp: '"large_airport","EU","UA","UA-32","KBP"',
};

type RealAirportIATA = keyof typeof airportsByIATA;

function isListOfRealAirports(
  iataList: ReadonlyArray<string>
): iataList is ReadonlyArray<RealAirportIATA> {
  return iataList.every((item) => item in airportsByIATA);
}

export function airports(
  ...args: ReadonlyArray<ReadonlyArray<RealAirportIATA> | ReadonlyArray<string>>
) {
  const list = args.flatMap((dataItems) =>
    isListOfRealAirports(dataItems)
      ? dataItems.map((iata) => airportsByIATA[iata] + '\n')
      : dataItems.map((listItem) => listItem + '\n')
  );

  return [header, ...list].join('');
}
