import { FC, MouseEventHandler } from 'react';

import './call-to-action.css';

interface CallToActionProps {
  variant?: 'secondary';
  href?: string;
  target?: '_blank';
  className?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}

export const CallToAction: FC<CallToActionProps> = ({
  variant,
  href,
  target,
  className,
  rel,
  onClick,
  children,
}) => {
  const classNames = [
    'call-to-action',
    `call-to-action_${variant || 'primary'}`,
  ];
  if (className) {
    classNames.push(className);
  }

  if (href != null) {
    return (
      <a
        href={href}
        onClick={onClick}
        target={target}
        className={classNames.join(' ')}
        rel={rel}
      >
        {children}
      </a>
    );
  } else {
    return (
      <button onClick={onClick} className={classNames.join(' ')}>
        {children}
      </button>
    );
  }
};
