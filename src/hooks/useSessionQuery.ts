// In a component that needs identity data frequently
import { useQuery } from "@tanstack/react-query";
import { fetchSessionDirect } from "@/lib/auth/sessionFetch";
import { TOKEN_KEY } from "@/types/constants";

const useSessionQuery = () => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  return useQuery({
    queryKey: ["session", token],
    queryFn: () => fetchSessionDirect(token),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
};

export default useSessionQuery;
