import type { ReactNode } from 'react';

interface Props {
  head?: ReactNode;
  children: ReactNode;
}

export function Layout({ head, children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5170ff" />
        {head}
      </head>
      <body>{children}</body>
    </html>
  );
}
