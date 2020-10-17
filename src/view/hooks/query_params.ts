import { parse, ParsedUrlQuery } from 'querystring';

import { useEffect, useState } from 'react';

export function useQueryParams() {
  const [queryParams, setQueryParams] = useState<ParsedUrlQuery>({});

  useEffect(() => {
    function handlePopState() {
      setQueryParams(parse(location.search.substring(1)));
    }

    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return queryParams;
}
