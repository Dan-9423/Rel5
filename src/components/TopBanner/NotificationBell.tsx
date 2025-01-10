import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function NotificationBell() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuItem className="cursor-pointer">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">New Update Available</p>
            <p className="text-xs text-gray-500">Check out the latest features</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Welcome to the System</p>
            <p className="text-xs text-gray-500">Get started with our quick tour</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}