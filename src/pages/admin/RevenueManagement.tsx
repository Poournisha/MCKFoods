import { useEffect, useState } from "react";
import { api } from "@/db/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Calendar } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import type { Order } from "@/types/types";

interface RevenueData {
  period: string;
  revenue: number;
  orders: number;
}

interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
}

export default function RevenueManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<RevenueData[]>([]);
  const [monthlyData, setMonthlyData] = useState<RevenueData[]>([]);
  const [yearlyData, setYearlyData] = useState<RevenueData[]>([]);
  const [salesReport, setSalesReport] = useState<SalesReport>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getAllOrders();
      setOrders(data);
      processRevenueData(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (ordersData: Order[]) => {
    const now = new Date();
    
    // Calculate sales report
    const completedOrders = ordersData.filter(o => o.status === "completed");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0) / 100;
    const report: SalesReport = {
      totalRevenue,
      totalOrders: ordersData.length,
      averageOrderValue: ordersData.length > 0 ? totalRevenue / ordersData.length : 0,
      completedOrders: completedOrders.length,
      pendingOrders: ordersData.filter(o => o.status === "pending").length,
      cancelledOrders: ordersData.filter(o => o.status === "cancelled").length,
    };
    setSalesReport(report);

    // Process weekly data (last 7 days)
    const weekly: RevenueData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayOrders = ordersData.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= dayStart && orderDate <= dayEnd && o.status === "completed";
      });
      
      weekly.push({
        period: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayOrders.reduce((sum, o) => sum + o.total_amount, 0) / 100,
        orders: dayOrders.length,
      });
    }
    setWeeklyData(weekly);

    // Process monthly data (last 12 months)
    const monthly: RevenueData[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const monthOrders = ordersData.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= monthStart && orderDate <= monthEnd && o.status === "completed";
      });
      
      monthly.push({
        period: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: monthOrders.reduce((sum, o) => sum + o.total_amount, 0) / 100,
        orders: monthOrders.length,
      });
    }
    setMonthlyData(monthly);

    // Process yearly data (last 5 years)
    const yearly: RevenueData[] = [];
    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i;
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);
      
      const yearOrders = ordersData.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= yearStart && orderDate <= yearEnd && o.status === "completed";
      });
      
      yearly.push({
        period: year.toString(),
        revenue: yearOrders.reduce((sum, o) => sum + o.total_amount, 0) / 100,
        orders: yearOrders.length,
      });
    }
    setYearlyData(yearly);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Revenue & Sales Analytics</h1>
          <p className="text-muted-foreground">Track your sales performance and revenue trends</p>
        </div>

        {/* Sales Report Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{salesReport.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">From completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{salesReport.averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Per order</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesReport.completedOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully fulfilled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesReport.pendingOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Graphs */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>Revenue and order trends over different time periods</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>

              <TabsContent value="weekly" className="space-y-4">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Revenue (₹)" />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(var(--secondary))" strokeWidth={2} name="Orders" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="monthly" className="space-y-4">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="Revenue (₹)" />
                      <Bar yAxisId="right" dataKey="orders" fill="hsl(var(--secondary))" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="yearly" className="space-y-4">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="Revenue (₹)" />
                      <Bar yAxisId="right" dataKey="orders" fill="hsl(var(--secondary))" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Detailed Sales Report */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Report Summary</CardTitle>
            <CardDescription>Comprehensive overview of all sales activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Total Revenue</TableCell>
                  <TableCell className="text-right">₹{salesReport.totalRevenue.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Orders</TableCell>
                  <TableCell className="text-right">{salesReport.totalOrders}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Completed Orders</TableCell>
                  <TableCell className="text-right">{salesReport.completedOrders}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pending Orders</TableCell>
                  <TableCell className="text-right">{salesReport.pendingOrders}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Cancelled Orders</TableCell>
                  <TableCell className="text-right">{salesReport.cancelledOrders}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Average Order Value</TableCell>
                  <TableCell className="text-right">₹{salesReport.averageOrderValue.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Completion Rate</TableCell>
                  <TableCell className="text-right">
                    {salesReport.totalOrders > 0 
                      ? ((salesReport.completedOrders / salesReport.totalOrders) * 100).toFixed(1) 
                      : 0}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
