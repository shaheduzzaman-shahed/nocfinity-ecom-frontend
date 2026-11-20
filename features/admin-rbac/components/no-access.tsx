import { ShieldAlert } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NoAccessProps {
  title?: string;
  message?: string;
}

export function NoAccess({
  title = "Access denied",
  message = "You do not have permission to view this page. Contact a Super Admin if you believe this is a mistake.",
}: NoAccessProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          {title}
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
    </Card>
  );
}
