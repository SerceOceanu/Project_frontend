import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/lib/firebase';
import { updateProfile, updateEmail, User } from 'firebase/auth';

interface UpdateProfileData {
  displayName?: string;
  photoURL?: string;
}

interface UpdateProfileParams {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileParams) => {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const updates: UpdateProfileData = {};
      
      if (data.firstName || data.lastName) {
        updates.displayName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
      }

      if (Object.keys(updates).length > 0) {
        await updateProfile(user, updates);
      }

      if (data.email && data.email !== user.email) {
        await updateEmail(user, data.email);
      }

      await user.reload();
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
}

export function useFirebaseUser() {
  return auth.currentUser;
}
