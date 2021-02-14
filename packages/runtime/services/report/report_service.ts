import { Report } from '../../lib/report';
import { Request, RequestParameters } from '../../lib/request';

export async function collect(payload: RequestParameters) {
  const [request, interceptors] = await Promise.all([
    Request.fromWebRequest(payload),
    import(/* webpackChunkName: "interceptors" */ '../../interceptors'),
  ]);

  const traceroute = await interceptors.run(request);

  return new Report(request, traceroute);
}
