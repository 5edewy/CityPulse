import {useInfiniteQuery} from '@tanstack/react-query';
import {requestAPICaller} from '../utils/apiHelpers';
import {configVars, queryKeys, SEARCH_EVENTS} from '../config';

// keep raw response shape (like your style)
type TicketmasterSearchRaw = any;

const PAGE_SIZE = 20;

// exactly like `fetchAuctionItems` but for Ticketmaster
const fetchEventsPage = async ({
  pageParam = 0, // TM pages are 0-based
  keyword,
  city,
  size = PAGE_SIZE,
  signal,
}: {
  pageParam: number;
  keyword?: string;
  city?: string;
  size?: number;
  signal?: AbortSignal;
}): Promise<TicketmasterSearchRaw> => {
  const response: TicketmasterSearchRaw = await requestAPICaller({
    requestConfig: {
      url: `${configVars.BASE_URL}${SEARCH_EVENTS}`,
      method: 'GET',
      params: {
        apikey: configVars.TM_API_KEY,
        keyword: keyword || undefined,
        city: city || undefined,
        page: pageParam, // 0-based
        size, // default 20
      },
      signal,
    },
  });

  return response; // RAW (same as your style)
};

// custom hook with pagination (same as your auction one)
export function useSearchEventsInfinite(
  keyword?: string,
  city?: string,
  size = PAGE_SIZE,
) {
  return useInfiniteQuery<TicketmasterSearchRaw>({
    queryKey: [queryKeys.EVENTS_SEARCH, keyword, city, size],
    queryFn: ({pageParam = 0, signal}) =>
      fetchEventsPage({
        pageParam: pageParam as number,
        keyword,
        city,
        size,
        signal,
      }),

    initialPageParam: 0, // TM starts at 0
    getNextPageParam: lastPage => {
      const p = lastPage?.page;
      if (!p) return undefined;
      const next = p.number + 1;
      return next < p.totalPages ? next : undefined; // load next if exists
    },
    enabled: Boolean((keyword && keyword.trim()) || (city && city.trim())),
    staleTime: 0,
  });
}
