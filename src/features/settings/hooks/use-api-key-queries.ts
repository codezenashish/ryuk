import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  generateApiKeyAction,
  getApiKeyAction,
} from "../actions/api-key-actions";

const API_KEY_QUERY_KEY = ["settings", "api-key"] as const;

export function useApiKeyQuery(userId: string | null | undefined, enabled = true) {
  return useQuery<string | null>({
    queryKey: [...API_KEY_QUERY_KEY, userId ?? ""],
    queryFn: async () => {
      if (!userId) return null;

      const result = await getApiKeyAction(userId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch API key");
      }

      return result.apiKey;
    },
    enabled: enabled && !!userId,
    staleTime: 15_000,
  });
}

export function useGenerateApiKeyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const result = await generateApiKeyAction(userId);
      if (!result.success) {
        throw new Error(result.error || "Failed to generate API key");
      }

      return result.apiKey;
    },
    onSuccess: (apiKey, userId) => {
      queryClient.setQueryData([...API_KEY_QUERY_KEY, userId], apiKey);
      queryClient.invalidateQueries({
        queryKey: [...API_KEY_QUERY_KEY, userId],
      });
    },
  });
}