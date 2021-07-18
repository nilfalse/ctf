import { hot } from 'react-hot-loader/root';
// eslint-disable-next-line import/order
import { FC, useCallback, useState } from 'react';
import * as preferenceService from '../../services/preference/preference_service';

import { Paragraph, Span } from './typography';

import './options_content.css';

export const _OptionsContent: FC = () => {
  const [renderPref, setRenderPref] = useState(
    preferenceService.getValue('render')
  );

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (evt) => {
      let shouldUpdate = true;

      void preferenceService
        .set({
          render: evt.currentTarget.value,
        })
        .then(() => {
          if (shouldUpdate) {
            setRenderPref(preferenceService.getValue('render'));
          }
        });

      return () => {
        shouldUpdate = false;
      };
    },
    []
  );

  return (
    <div className="options">
      <div className="options__ruler"></div>

      <form className="options__content">
        <Paragraph>Which flags to use</Paragraph>

        <label>
          <input
            onChange={handleChange}
            type="radio"
            name="render"
            value="twemoji"
            checked={renderPref === 'twemoji'}
          />{' '}
          <Span size="s">Twemoji</Span>
        </label>
        <label>
          <input
            onChange={handleChange}
            type="radio"
            name="render"
            value="emoji"
            checked={renderPref === 'emoji'}
          />{' '}
          <Span size="s">Native emoji</Span>
        </label>

        <Paragraph size="xs">* This option has no effect on Windows.</Paragraph>
      </form>
    </div>
  );
};

export const OptionsContent = hot(_OptionsContent);
