import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/database/db";
import { sleepLogs } from "@/database/schema";
import { eq } from "drizzle-orm";

const ProfilePage = () => {
  const { user, signOut } = useAuth();

  const { data: sleepStats } = useQuery({
    queryKey: ["sleepStats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const logs = await db.query.sleepLogs.findMany({
        where: eq(sleepLogs.userId, user.id),
      });

      const totalLogs = logs.length;
      const avgDuration = totalLogs > 0
        ? logs.reduce((acc, log) => acc + parseInt(log.duration), 0) / totalLogs
        : 0;

      return {
        totalLogs,
        avgDuration,
      };
    },
  });

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">User ID:</span> {user?.id}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Total Sleep Logs:</span> {sleepStats?.totalLogs || 0}</p>
              <p><span className="font-medium">Average Sleep Duration:</span> {sleepStats?.avgDuration ? `${Math.round(sleepStats.avgDuration)} minutes` : 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="destructive" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;