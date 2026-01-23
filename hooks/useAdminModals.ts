import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, CreateModal } from '@/types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://145.239.30.37:3000';

export function useModals() {
  return useQuery({
    queryKey: ['admin-modals'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/modals`, {
        cache: 'no-store',
      });
    
      if (!response.ok) {
        throw new Error(`Failed to fetch modals: ${response.status}`);
      }
    
      const data: Modal[] = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateModal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modalData: CreateModal): Promise<Modal> => {
      const response = await fetch(`${API_URL}/modals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modalData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create modal');
      }
      
      const data: Modal = await response.json();
      return data;
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
      const response = await fetch(`${API_URL}/modals/${id}`, {
        method: 'DELETE',
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete modal');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modals'] });
    },
  });
}

