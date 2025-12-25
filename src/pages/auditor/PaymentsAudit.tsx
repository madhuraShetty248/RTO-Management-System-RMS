import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/services';
import { Payment } from '@/types';
import { Search, Download, Filter, Loader2, CheckCircle2, XCircle, Clock, ArrowUpRight, CreditCard } from 'lucide-react';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'COMPLETED': return <Badge className="badge-success"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
    case 'PENDING': return <Badge className="badge-warning"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case 'FAILED': return <Badge className="badge-error"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
    case 'REFUNDED': return <Badge className="badge-info"><ArrowUpRight className="h-3 w-3 mr-1" />Refunded</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

// Mock data for audit
const mockPayments: Payment[] = [
  { id: '1', user_id: 'u1', amount: 5000, status: 'COMPLETED', payment_method: 'UPI', transaction_id: 'TXN001234567', created_at: '2024-12-20T10:30:00Z', updated_at: '2024-12-20T10:30:00Z' },
  { id: '2', user_id: 'u2', amount: 2500, status: 'COMPLETED', payment_method: 'CARD', transaction_id: 'TXN001234568', created_at: '2024-12-20T09:15:00Z', updated_at: '2024-12-20T09:15:00Z' },
  { id: '3', user_id: 'u3', amount: 1000, status: 'PENDING', payment_method: 'NETBANKING', created_at: '2024-12-19T16:45:00Z', updated_at: '2024-12-19T16:45:00Z' },
  { id: '4', user_id: 'u4', amount: 7500, status: 'COMPLETED', payment_method: 'UPI', transaction_id: 'TXN001234570', created_at: '2024-12-19T14:20:00Z', updated_at: '2024-12-19T14:20:00Z' },
  { id: '5', user_id: 'u5', amount: 3000, status: 'FAILED', payment_method: 'CARD', created_at: '2024-12-19T11:00:00Z', updated_at: '2024-12-19T11:00:00Z' },
  { id: '6', user_id: 'u6', amount: 1500, status: 'REFUNDED', payment_method: 'UPI', transaction_id: 'TXN001234572', refund_reason: 'Duplicate payment', created_at: '2024-12-18T10:30:00Z', updated_at: '2024-12-18T10:30:00Z' },
];

const PaymentsAudit: React.FC = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleExport = () => {
    toast({ title: 'Exporting', description: 'Payment audit report will be downloaded shortly' });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) || payment.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCompleted = payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'REFUNDED').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments Audit</h1>
          <p className="text-muted-foreground">Detailed payment transactions audit log</p>
        </div>
        <Button className="btn-gradient" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />Export Audit Log
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">{payments.length}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-success">₹{totalCompleted.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-warning">₹{totalPending.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Refunded</p>
            <p className="text-2xl font-bold text-destructive">₹{totalRefunded.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by transaction ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-muted/50" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-muted/50"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No payments found</TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.transaction_id || `PAY-${payment.id}`}</p>
                          <p className="text-sm text-muted-foreground">ID: {payment.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{payment.payment_method || 'N/A'}</Badge></TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(payment.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{payment.refund_reason || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsAudit;
