import BaseIcon from '@/assets/base-icon.svg?react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Camera, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import user from '@/api/user';
import { useDialog, useUploadFile } from '@/hooks';
import type { IUser } from '@/types/user.type';
import { CONFIG } from '@/config';

const ID = 'edit-profile';

const EditUserProfile = () => {
  const { closeDialog } = useDialog();
  const { data: me } = useQuery({
    queryKey: ['user'],
    queryFn: () => user.get(),
  });

  const [userData, setUserData] = useState({ name: '', picture: '' });
  const { uploadFileFn, loading } = useUploadFile();

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: (data: Partial<IUser>) => user.update({ _id: me._id, data }),
    onSuccess: () => {
      closeDialog(ID);
    },
  });

  const handleAvatarUpload = useCallback(async () => {
    if (loading) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async e => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (file.size > CONFIG.MAX_FILE_SIZE) {
          alert(`File size cannot exceed ${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
          return;
        }
        const url = await uploadFileFn(file);
        if (url) setUserData(prev => ({ ...prev, picture: url }));
      }
    };
    input.click();
  }, [loading, uploadFileFn]);

  useEffect(() => {
    if (me) setUserData({ name: me.name ?? '', picture: me.picture ?? '' });
  }, [me, open]);

  const handleUpdate = useCallback(() => {
    if (!userData.name.trim() || isPending) return;
    updateUser(userData);
  }, [userData, isPending, updateUser]);

  const handleNameChange = useCallback((e: Event) => {
    const { value } = e.target as HTMLInputElement;
    setUserData(prev => ({ ...prev, name: value }));
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleUpdate();
    },
    [handleUpdate]
  );

  return (
    <div className="w-[448px]">
      <div className="p-6 pb-8">
        <BaseIcon className="mb-4" />
        <p className="mb-[6px] text-base font-semibold text-neutral-900">Edit profile</p>
        <p className="text-sm text-neutral-500">Update your profile information.</p>
        <div className="relative mx-auto mt-8 mb-4 size-20 rounded-full bg-neutral-200">
          {userData.picture ? (
            <img src={userData.picture} alt="" className="size-full rounded-full" />
          ) : (
            <span className="flex size-full items-center justify-center rounded-full bg-neutral-200 text-2xl font-medium text-neutral-900">
              {userData.name
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </span>
          )}
          <span
            className="absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900 transition-colors hover:bg-gray-800"
            onClick={handleAvatarUpload}
          >
            {loading ? (
              <LoaderCircle className="size-4 animate-spin text-white" />
            ) : (
              <Camera className="h-4 w-4 text-white" />
            )}
          </span>
        </div>

        <div className="mb-6">
          <span className="mb-2 block text-sm font-medium text-neutral-900">Name</span>
          <Input
            className="h-10"
            value={userData.name}
            onChange={handleNameChange}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      <div className="rounded-b-2xl border-t border-neutral-200 bg-neutral-50 p-6">
        <Button
          className={cn('h-10 w-full', isPending && 'cursor-default')}
          disabled={!userData.name.trim()}
          onClick={handleUpdate}
        >
          {isPending && <LoaderCircle className="size-4 animate-spin" />}
          {isPending ? 'Updating...' : 'Update profile'}
        </Button>
      </div>
    </div>
  );
};

EditUserProfile.id = ID;
export default EditUserProfile;
