import { toast } from 'sonner';

export const copyEmbedCode = async (accountId: string, _id: string) => {
  const code = `<script src="https://assets.heyway.chat/${accountId}/${_id}/widget.js" async></script>`;
  await navigator.clipboard.writeText(code);
  toast.success('Embed code copied to clipboard');
};
