"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Folder {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useFolders() {
  const queryClient = useQueryClient();

  const foldersQuery = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const res = await fetch("/api/folders");
      if (!res.ok) throw new Error("Failed to fetch folders");
      const data = await res.json();
      return (data.folders as Folder[]) || [];
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: async (folderData: { name: string; color?: string }) => {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(folderData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create folder");
      }

      const data = await res.json();
      return data.folder as Folder;
    },
    onMutate: async (newFolderData) => {
      await queryClient.cancelQueries({ queryKey: ["folders"] });
      const previousFolders = queryClient.getQueryData<Folder[]>(["folders"]);

      if (previousFolders) {
        const tempFolder: Folder = {
          id: `temp-${Date.now()}`,
          name: newFolderData.name,
          color: newFolderData.color || "#6366F1",
          userId: "temp-user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        queryClient.setQueryData<Folder[]>(["folders"], (old) => [
          tempFolder,
          ...(old || []),
        ]);
      }

      return { previousFolders };
    },
    onError: (_err, _newFolder, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(["folders"], context.previousFolders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: async (updateData: { id: string; name?: string; color?: string }) => {
      const res = await fetch(`/api/folders/${updateData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error("Failed to update folder");
      const data = await res.json();
      return data.folder as Folder;
    },
    onMutate: async (updateData) => {
      await queryClient.cancelQueries({ queryKey: ["folders"] });
      const previousFolders = queryClient.getQueryData<Folder[]>(["folders"]);

      if (previousFolders) {
        queryClient.setQueryData<Folder[]>(["folders"], (old) =>
          old
            ? old.map((f) =>
                f.id === updateData.id
                  ? ({ ...f, ...updateData, updatedAt: new Date().toISOString() } as Folder)
                  : f
              )
            : []
        );
      }
      return { previousFolders };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFolders) queryClient.setQueryData(["folders"], context.previousFolders);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/folders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete folder");
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["folders"] });
      const previousFolders = queryClient.getQueryData<Folder[]>(["folders"]);

      if (previousFolders) {
        queryClient.setQueryData<Folder[]>(["folders"], (old) =>
          old ? old.filter((f) => f.id !== id) : []
        );
      }

      return { previousFolders };
    },
    onError: (_err, _id, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(["folders"], context.previousFolders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  return {
    folders: foldersQuery.data || [],
    isLoading: foldersQuery.isLoading,
    isError: foldersQuery.isError,
    error: foldersQuery.error,
    createFolder: createFolderMutation.mutateAsync,
    updateFolder: updateFolderMutation.mutateAsync,
    deleteFolder: deleteFolderMutation.mutateAsync,
    isCreating: createFolderMutation.isPending,
  };
}
