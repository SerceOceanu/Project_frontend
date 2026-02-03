import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, CreateModal } from '@/types/types';
import { adminApiRequest } from '@/hooks/useAdminProducts';

export function useModals() {
  return useQuery({
    queryKey: ['admin-modals'],
    queryFn: () => adminApiRequest<Modal[]>('/modals'),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateModal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modalData: CreateModal): Promise<Modal> => {
      return adminApiRequest<Modal>('/modals', {
        method: 'POST',
        body: modalData,
        useJson: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modals'] });
    },
  });
}

export function useDeleteModal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      return adminApiRequest<void>(`/modals/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modals'] });
    },
  });
}

