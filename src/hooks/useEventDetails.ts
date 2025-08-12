import {useQuery} from '@tanstack/react-query';
import {requestAPICaller} from '../utils/apiHelpers';
import {configVars, EVENT_DETAILS, queryKeys} from '../config';

export type TicketmasterEventRaw = any;

/** request up top */
const getEventDetailsRequest = async (
  id: string,
  signal?: AbortSignal,
): Promise<TicketmasterEventRaw> => {
  const response = await requestAPICaller<TicketmasterEventRaw>({
    requestConfig: {
      url: `${configVars.BASE_URL}${EVENT_DETAILS(id)}`,
      method: 'GET',
      params: {apikey: configVars.TM_API_KEY},
      signal,
    },
  });
  return response;
};

/** hook */
export function useEventDetails(id?: string) {
  return useQuery<TicketmasterEventRaw>({
    queryKey: [queryKeys.EVENT_DETAILS, id],
    queryFn: ({signal}) => getEventDetailsRequest(id as string, signal),
    enabled: Boolean(id),
  });
}
