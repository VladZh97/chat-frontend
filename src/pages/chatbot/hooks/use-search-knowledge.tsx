import { useDebounce } from '@/hooks';
import type { IKnowledge } from '@/types/knowledge.type';
import { useMemo } from 'preact/hooks';

const useSearchKnowledge = (data: IKnowledge[], search: string) => {
  const debouncedSearch = useDebounce(search, 500);
  return useMemo(() => {
    if (!debouncedSearch) return data;
    return data?.filter(item => {
      if (item.type === 'website') {
        return (item.metadata as { url: string }).url
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      }
      if (item.type === 'file') {
        return (
          (item.metadata as { name: string; extension: string }).name
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          (item.metadata as { name: string; extension: string }).extension
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        );
      }
      if (item.type === 'text') {
        return (item.metadata as { title: string }).title
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      }
      return false;
    });
  }, [data, debouncedSearch]);
};

export default useSearchKnowledge;
