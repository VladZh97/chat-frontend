import Icon from '@/assets/icon.svg?react';
import { Button } from '@/components/ui/button';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { CodeXml } from 'lucide-react';
import { copyEmbedCode } from '@/utils/copy-embed-code';
import { useDialog } from '@/hooks';

const CopyEmbedCodeDialog = () => {
  const { closeDialog } = useDialog();
  const { accountId, _id } = useChatbotStoreShallow(s => ({
    accountId: s.accountId,
    _id: s._id,
  }));

  return (
    <div className="w-[448px]">
      <div className="pt-6">
        <div className="px-6">
          <Icon className="mb-4" />
          <p className="mb-6 cursor-pointer text-base font-semibold text-stone-900">
            Add Heyway Chat to your site
          </p>

          <p className="mb-6 rounded-lg bg-orange-100 px-4 py-3 text-xs font-medium text-stone-950">
            Copy the code below and paste it into your site’s HTML, <br /> just before the
            &lt;/head&gt; tag.
          </p>
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-stone-950">Code</p>
            <p className="shadow-card overflow-x-auto rounded-lg bg-white p-3 text-sm leading-normal font-normal break-all text-stone-700">
              {`<script async src="https://assets.heyway.chat/${accountId}/${_id}.js"></script>`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => closeDialog('copy-embed-code-dialog')}
          >
            Close
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              copyEmbedCode(accountId, _id);
              closeDialog('copy-embed-code-dialog');
            }}
          >
            <CodeXml />
            Copy code
          </Button>
        </div>
      </div>
    </div>
  );
};

CopyEmbedCodeDialog.id = 'copy-embed-code-dialog';

export { CopyEmbedCodeDialog };
