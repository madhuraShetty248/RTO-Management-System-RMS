import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsService, rtoService, userService } from '@/services';
import { Building2, Users, Shield, Activity, TrendingUp, AlertTriangle, Server, CheckCircle2 } from 'lucide-react';

const stats = [
  { title: 'Total RTO Offices', value: '25', icon: Building2, color: 'from-primary to-secondary', change: '+2 this month' },
  { title: 'Total Users', value: '15,240', icon: Users, color: 'from-success to-accent', change: '+340 new users' },
  { title: 'Active Roles', value: '6', icon: Shield, color: 'from-warning to-destructive', change: 'All configured' },
  { title: 'System Health', value: '99.9%', icon: Activity, color: 'from-secondary to-primary', change: 'Operational' },
];

const systemStatus = [
  { service: 'Database', status: 'operational', uptime: '99.99%' },
  { service: 'API Gateway', status: 'operational', uptime: '99.95%' },
  { service: 'Payment Gateway', status: 'operational', uptime: '99.90%' },
  { service: 'Notification Service', status: 'operational', uptime: '99.85%' },
];

const recentAdminActions = [
  { action: 'New RTO Office Created', user: 'Admin', time: '2 hours ago' },
  { action: 'User Role Updated', user: 'Admin', time: '4 hours ago' },
  { action: 'System Configuration Changed', user: 'Admin', time: '1 day ago' },
  { action: 'Office Deactivated', user: 'Admin', time: '2 days ago' },
];

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">System-wide overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="stat-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* System Status & Recent Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="h-5 w-5 text-primary" />System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemStatus.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                  <span className="font-medium">{service.service}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Uptime: {service.uptime}</span>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Recent Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAdminActions.map((activity, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
