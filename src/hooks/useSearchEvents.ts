import {useQuery} from '@tanstack/react-query';
import {requestAPICaller} from '../utils/apiHelpers';
import {configVars, queryKeys, SEARCH_EVENTS} from '../config';

export type TicketmasterSearchRaw = any;

/** request up top (same style as your bidding example) */
const searchEventsRequest = async (
  keyword?: string,
  city?: string,
  page = 0,
  size = 20,
  signal?: AbortSignal,
): Promise<TicketmasterSearchRaw> => {
  const response = await requestAPICaller<TicketmasterSearchRaw>({
    requestConfig: {
      url: `${configVars.BASE_URL}${SEARCH_EVENTS}`,
      method: 'GET',
      params: {
        apikey: configVars.TM_API_KEY,
        keyword: keyword || undefined,
        city: city || undefined,
        page,
        size,
      },
      signal,
    },
    // no auth, no extras — returns raw data
  });
  return response;
};

/** hook */
export function useSearchEvents(
  keyword?: string,
  city?: string,
  page = 0,
  size = 20,
) {
  return useQuery<TicketmasterSearchRaw>({
    queryKey: [queryKeys.EVENTS_SEARCH, keyword || '', city || '', page, size],
    queryFn: ({signal}) =>
      searchEventsRequest(keyword, city, page, size, signal),
    enabled: Boolean((keyword && keyword.trim()) || (city && city.trim())),
    // smooth paging between page changes
    placeholderData: (prev: any) => prev,
  });
}
