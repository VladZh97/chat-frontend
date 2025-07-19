import { useGetChatbot } from '../hooks';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useGetChatbot();
  return isLoading ? null : children;
};

export default Wrapper;
