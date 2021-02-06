import { FC, CSSProperties } from 'react';

import * as countryService from '../../../services/country/country_service';
import { flags, twemoji } from '../../../services/emoji/emoji_service';
import * as preferenceService from '../../../services/preference/preference_service';
import { Paragraph } from '../typography';

import './_country_item.css';

interface CountryItemProps {
  countryCode: string;
  shouldRenderFlag?: boolean;
}

export const CountryItem: FC<CountryItemProps> = ({
  countryCode,
  shouldRenderFlag = true,
  children,
}) => {
  const flag = flags.lookup(countryCode);

  return (
    <Paragraph
      size="xs"
      className={classNamesFactory(!!flag)}
      style={stylesFactory({ countryCode, shouldRenderFlag })}
      data-flag={shouldRenderFlag ? flag.emoji : undefined}
    >
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

function classNamesFactory(hasFlag: boolean) {
  const classNames = [
    'country-item',
    `country-item_${preferenceService.getValue('render')}`,
  ];
  if (hasFlag) {
    classNames.push('country-item_with-flag');
  }

  return classNames.join(' ');
}

function stylesFactory({
  countryCode,
  shouldRenderFlag,
}: CountryItemProps): CSSProperties | undefined {
  switch (preferenceService.getValue('render')) {
    case 'twemoji':
      return shouldRenderFlag
        ? {
            background: `url('${twemoji.getFilePath(countryCode)}') no-repeat`,
          }
        : undefined;
    default:
      return undefined;
  }
}
