import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  growth?: number;
  icon: ReactNode;
}

export default function StatCard({ title, value, growth, icon }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-gray-600">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        {growth !== undefined && (
          <div className="flex items-center gap-1 text-sm mt-1">
            {growth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={growth >= 0 ? "text-green-600" : "text-red-600"}>
              {Math.abs(growth).toFixed(1)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
