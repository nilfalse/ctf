import { FC } from 'react';

import './call-to-action.css';

interface CallToActionProps {
  variant?: 'secondary';
  href: string;
  target?: '_blank';
  className?: string;
  rel?: string;
}

export const CallToAction: FC<CallToActionProps> = ({
  variant,
  href,
  target,
  className,
  rel,
  children,
}) => {
  const classNames = [
    'call-to-action',
    `call-to-action_${variant || 'primary'}`,
  ];
  if (className) {
    classNames.push(className);
  }

  return (
    <a href={href} target={target} className={classNames.join(' ')} rel={rel}>
      {children}
    </a>
  );
};
