import { useEffect, useState } from "react";
import { getUsers, type User } from "@/api/userApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentUsers() {
  const [usres, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data.slice(0, 5));
    });
  }, []);

  return (
    <div className="space-y-8">
      {usres.map((user) => (
        <div key={user.userId} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`}
              alt="Avatar"
            />
            <AvatarFallback>{user.userName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{user.userName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="ml-auto font-medium text-sm text-blue-600">
            {user.role}
          </div>
        </div>
      ))}
    </div>
  );
}
