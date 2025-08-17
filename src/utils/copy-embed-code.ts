import { toast } from 'sonner';

export const copyEmbedCode = async (accountId: string, _id: string) => {
  const code = `<script async src="https://assets.heyway.chat/${accountId}/${_id}.js"></script>`;
  await navigator.clipboard.writeText(code);
  toast.success('Embed code copied to clipboard');
};
