import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/database/db";
import { sleepLogs } from "@/database/schema";
import { eq } from "drizzle-orm";
import { format } from "date-fns";

const DashboardPage = () => {
  const { user } = useAuth();

  const { data: recentSleepLogs } = useQuery({
    queryKey: ["sleepLogs", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await db.query.sleepLogs.findMany({
        where: eq(sleepLogs.userId, user.id),
        orderBy: (logs) => logs.date,
        limit: 5,
      });
    },
  });

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sleep Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSleepLogs?.length ? (
              <div className="space-y-2">
                {recentSleepLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{format(new Date(log.date), "MMM d, yyyy")}</p>
                      <p className="text-sm text-gray-500">Duration: {log.duration}</p>
                    </div>
                    <div className="text-sm">
                      Quality: {log.quality}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No sleep logs yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Average Sleep Duration: Calculating...</p>
              <p>Sleep Quality Trend: Calculating...</p>
              <p>Consistency Score: Calculating...</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full p-2 bg-primary text-primary-foreground rounded">
                Log New Sleep
              </button>
              <button className="w-full p-2 border rounded">
                Take Assessment
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;