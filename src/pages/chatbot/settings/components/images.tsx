import ChatIcon from '@/assets/chat-icon.png';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash, Upload, Image, LoaderCircle } from 'lucide-react';
import Icon from '@/assets/chat.svg';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { useUploadFile } from '@/hooks';
import { useState } from 'preact/hooks';
import { environment } from '@/environment';

const Images = () => {
  const { uploadFileFn, loading } = useUploadFile();
  const [type, setType] = useState<'avatarIcon' | 'chatIcon'>();
  const { avatarIcon, chatIcon, setChatbot, backgroundColor } = useChatbotStoreShallow(s => ({
    avatarIcon: s.avatarIcon,
    chatIcon: s.chatIcon,
    setChatbot: s.setChatbot,
    backgroundColor: s.backgroundColor,
  }));

  const handleImageUpload = async (type: 'avatarIcon' | 'chatIcon') => {
    if (loading) return;
    setType(type);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async e => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (file.size > 4 * 1024 * 1024) {
          alert('File size cannot exceed 4MB');
          return;
        }
        const url = await uploadFileFn(file);
        if (url) {
          setChatbot({ [type]: url });
          setType(undefined);
        }
      }
    };
    input.click();
  };

  const handleRemoveImage = (type: 'avatarIcon' | 'chatIcon') => {
    setChatbot({ [type]: '' });
  };

  return (
    <div className="mb-6 grid grid-cols-2 gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        {avatarIcon ? (
          <img
            src={`${environment.assetsBaseUrl}/${avatarIcon}`}
            alt="Chatbot image"
            className="size-12 overflow-hidden rounded-full object-cover"
          />
        ) : (
          <span className="flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100">
            <Image className="size-5 text-neutral-700" />
          </span>
        )}
        <div>
          <Label className="mb-2">Avatar</Label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleImageUpload('avatarIcon')}>
              {loading && type === 'avatarIcon' ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload />
                  Upload
                </>
              )}
            </Button>
            {avatarIcon && (
              <Button
                variant="destructive"
                size="sm"
                className="w-8 px-0"
                onClick={() => handleRemoveImage('avatarIcon')}
              >
                <Trash />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div
          className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#0A0A0A1A]"
          style={{ backgroundColor: backgroundColor }}
        >
          <img
            src={chatIcon ? `${environment.assetsBaseUrl}/${chatIcon}` : Icon}
            alt="Chatbot image"
            className="size-6"
          />
        </div>
        <div>
          <Label className="mb-2">Chat icon</Label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleImageUpload('chatIcon')}>
              {loading && type === 'chatIcon' ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload />
                  Upload
                </>
              )}
            </Button>
            {chatIcon && (
              <Button
                variant="destructive"
                size="sm"
                className="w-8 px-0"
                onClick={() => handleRemoveImage('chatIcon')}
              >
                <Trash />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Images;
