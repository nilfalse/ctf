import { FC } from 'react';

import * as countryService from '../../../services/country/country_service';
import { flags } from '../../../services/emoji/emoji_service';
import { Paragraph } from '../typography';

interface CountryItemProps {
  countryCode: string;
  shouldRenderFlag?: boolean;
}

interface TypographyProps {
  size: 'xs';
  className: string;
  'data-flag': null | string;
}

export const CountryItem: FC<CountryItemProps> = ({
  countryCode,
  shouldRenderFlag = true,
  children,
}) => {
  const flag = flags.lookup(countryCode);

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
    typographyProps['data-flag'] = flag.emoji;
  }

  return (
    <Paragraph {...typographyProps}>
      {children ? (
        <>
          {children}
          <br />
        </>
      ) : null}
      <strong>{countryService.getName(countryCode)}</strong>
    </Paragraph>
  );
};
