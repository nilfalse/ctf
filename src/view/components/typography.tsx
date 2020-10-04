import * as React from 'react';

import './typography.css';

interface FactoryParams {
  tag: 'p' | 'span' | 'a';
  className?: string;
}

interface TypographyProps {
  variant?: 'mono' | 'light' | 'handwriting';
  size?: 'l' | 's' | 'xs';
  className?: string | ReadonlyArray<string>;
}

const typographyFactory = ({
  tag,
  className: componentClassName,
}: FactoryParams): React.FC<TypographyProps> => {
  const Component = tag;

  return ({ variant, size, className, children, ...rest }) => {
    let classNames = ['typography'];
    if (variant) {
      classNames.push('typography_' + variant);
    }
    if (size) {
      classNames.push('typography_' + size);
    }
    if (componentClassName) {
      classNames.push(componentClassName);
    }
    if (className) {
      classNames = classNames.concat(className);
    }

    return (
      <Component {...rest} className={classNames.join(' ')}>
        {children}
      </Component>
    );
  };
};

export const Paragraph = typographyFactory({ tag: 'p' }) as React.FC<
  TypographyProps & React.AnchorHTMLAttributes<HTMLParagraphElement>
>;

export const Span = typographyFactory({ tag: 'span' }) as React.FC<
  TypographyProps & React.AnchorHTMLAttributes<HTMLParagraphElement>
>;

export const Link = typographyFactory({
  tag: 'a',
  className: 'link',
}) as React.FC<TypographyProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>;
