import * as React from 'react';
import { useEffect, useState } from 'react';

import * as emoji from '../../../lib/emoji';
import { Paragraph } from '../typography';

interface CountryItemProps {
  countryCode: string;
  shouldRenderFlag?: boolean;
}

function useFlag(countryCode: string) {
  const [flag, setFlag] = useState<string | null>(null);

  useEffect(() => {
    let shouldIgnore = false;

    emoji.fromISOCountryCode(countryCode).then((flag) => {
      if (!flag || shouldIgnore) {
        return;
      }

      setFlag(flag.emoji);
    });

    return () => {
      shouldIgnore = true;
    };
  }, [countryCode]);

  return flag;
}

interface TypographyProps {
  size: 'xs';
  className: string;
  'data-flag': null | string;
}

export const CountryItem: React.FC<CountryItemProps> = ({
  countryCode,
  shouldRenderFlag = true,
  children,
}) => {
  const country = chrome.i18n.getMessage('country_name_' + countryCode);
  const flag = useFlag(countryCode);

  const classNames = ['traceroute__country-item'];
  if (flag) {
    classNames.push('traceroute__country-item_flagged');
  }

  const typographyProps: TypographyProps = {
    size: 'xs' as const,
    className: classNames.join(' '),
    'data-flag': null,
  };
  if (shouldRenderFlag) {
    typographyProps['data-flag'] = flag;
  }

  return (
    <Paragraph {...typographyProps}>
      {children ? (
        <>
          {children}
          <br />
        </>
      ) : null}
      <strong>{country}</strong>
    </Paragraph>
  );
};
