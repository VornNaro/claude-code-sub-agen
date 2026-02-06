"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

/** Placeholder type for future order integration */
interface OrderRow {
  id: string;
  date: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
}

const statusVariant: Record<OrderRow["status"], "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  processing: "secondary",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

// No orders yet -- this will be replaced with real data from the order store/tRPC
const orders: OrderRow[] = [];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Orders</h2>
        <p className="text-sm text-muted-foreground">
          Track and manage your vehicle purchases and orders.
        </p>
      </div>

      {orders.length === 0 ? (
        /* Empty state */
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-5">
                <ShoppingBag className="size-10 text-muted-foreground" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">No orders yet</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                When you purchase or reserve a vehicle, your orders will appear
                here so you can track their status.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/vehicles">Start Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Orders table */
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              A list of all your past and current orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-muted-foreground">
                      {order.date}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[order.status]}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      ${order.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
