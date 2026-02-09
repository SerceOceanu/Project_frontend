import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, CreateModal } from '@/types/types';
import { adminApiRequest } from '@/hooks/useAdminProducts';
import { Popup } from './usePopups';

export function useModals() {
  return useQuery({
    queryKey: ['admin-popups'],
    queryFn: () => adminApiRequest<Popup[]>('/pop-ups'),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateModal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modalData: CreateModal): Promise<Popup> => {
      return adminApiRequest<Popup>('/pop-ups', {
        method: 'POST',
        body: {
          title: modalData.name,
          description: modalData.description,
          active: modalData.enabled,
        },
        useJson: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-popups'] });
      queryClient.invalidateQueries({ queryKey: ['popups'] });
    },
  });
}

export function useDeleteModal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      return adminApiRequest<void>(`/pop-ups/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-popups'] });
      queryClient.invalidateQueries({ queryKey: ['popups'] });
    },
  });
}

export function useUpdatePopupStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ popUpId, active }: { popUpId: string; active: boolean }): Promise<Popup> => {
      console.log('Updating popup status:', { popUpId, active, endpoint: `/pop-ups/${popUpId}/status` });
      return adminApiRequest<Popup>(`/pop-ups/${popUpId}/status`, {
        method: 'PATCH',
        body: { active },
        useJson: true,
      });
    },
    onSuccess: async () => {
      // Invalidate and refetch both queries to ensure data is updated
      await queryClient.invalidateQueries({ queryKey: ['admin-popups'] });
      await queryClient.invalidateQueries({ queryKey: ['popups'] });
      // Force refetch to immediately update the data
      await queryClient.refetchQueries({ queryKey: ['admin-popups'] });
      await queryClient.refetchQueries({ queryKey: ['popups'] });
    },
  });
}

