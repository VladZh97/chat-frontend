import { cn } from '@/lib/utils';
import { MessageCircle, MessageSquareText } from 'lucide-react';
import { TABLE_SIZES } from '../constants';

const ChatDetails = () => {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow">
      <div className="pb-6">
        <div className="mb-1 flex items-center gap-2 text-base font-semibold text-neutral-900">
          <MessageSquareText className="size-4 text-neutral-500" />
          Chats details
        </div>
        <span className="text-sm text-neutral-700">Showing recent chats and its details</span>
      </div>
      <div className="divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white shadow-sm">
        <div className="flex h-10 items-center text-sm font-medium text-neutral-500">
          <span className={cn(TABLE_SIZES.STATUS, 'px-3')}>Status</span>
          <span className={cn(TABLE_SIZES.INITIAL_MESSAGE, 'px-3')}>Initial message</span>
          <span className={cn(TABLE_SIZES.MESSAGES, 'px-3')}>Messages</span>
          <span className={cn(TABLE_SIZES.DATE, 'px-3')}>Date</span>
          <span className={cn(TABLE_SIZES.ACTIONS, 'px-3')}></span>
        </div>
        {/* <Row />
        <Row />
        <Row />
        <Row /> */}
        <EmptyState />
      </div>
    </div>
  );
};

export default ChatDetails;

// const Row = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <div
//       className={cn(
//         'flex h-[54px] items-center text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50',
//         isOpen && 'bg-neutral-50'
//       )}
//     >
//       <span className={cn(TABLE_SIZES.STATUS, 'px-3')}>
//         <span className="inline-flex h-[22px] items-center justify-center rounded-md bg-neutral-100 px-2.5 text-xs font-semibold text-neutral-700">
//           Finished
//         </span>
//         {/* <span className="inline-flex h-[22px] items-center justify-center rounded-md bg-green-200 px-2.5 text-xs font-semibold text-green-800">
//           Live
//         </span> */}
//       </span>
//       <span className={cn(TABLE_SIZES.INITIAL_MESSAGE, 'px-3')}>
//         <span>Can you help me with something?</span>
//       </span>
//       <span className={cn(TABLE_SIZES.MESSAGES, 'px-3')}>10</span>
//       <span className={cn(TABLE_SIZES.DATE, 'px-3')}>
//         {moment().format('MMMM D, YYYY • HH:mm CET')}
//       </span>
//       <span className={cn(TABLE_SIZES.ACTIONS, 'px-3')}>
//         <Popover open={isOpen} onOpenChange={setIsOpen}>
//           <PopoverTrigger>
//             <span
//               className={cn(
//                 'flex size-8 cursor-pointer items-center justify-center rounded-md text-neutral-900 transition-colors hover:bg-neutral-200',
//                 isOpen && 'bg-neutral-200'
//               )}
//             >
//               <Ellipsis className="size-4" />
//             </span>
//           </PopoverTrigger>
//           <PopoverContent className="w-48 space-y-1 rounded-lg bg-white p-2 shadow-lg">
//             <div className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-neutral-900 hover:bg-neutral-100">
//               <MessageSquareMore className="size-4" />
//               Chat details
//             </div>
//             <div className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-red-600 hover:bg-red-50">
//               <Trash className="size-4" />
//               Delete conversation
//             </div>
//           </PopoverContent>
//         </Popover>
//       </span>
//     </div>
//   );
// };

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <MessageCircle className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No chats yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        You'll see all your chat conversations here once users start chatting with your chatbot.
      </p>
    </div>
  );
};
