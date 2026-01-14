import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  MapPin,
  Route,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ScheduledJob {
  id: string;
  jobDescription: string;
  customerName: string;
  customerAddress: string;
  postcode: string;
  estimatedHours: number;
  scheduledDate?: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  trade: string;
}

interface JobSchedulerProps {
  jobs: ScheduledJob[];
  onScheduleJob?: (jobId: string, date: string, order: number) => void;
}

// UK Postcode area groupings for geographic optimization
const POSTCODE_REGIONS: Record<string, string> = {
  'SW': 'South West London',
  'SE': 'South East London',
  'E': 'East London',
  'N': 'North London',
  'NW': 'North West London',
  'W': 'West London',
  'EC': 'Central London East',
  'WC': 'Central London West',
  'BR': 'Bromley',
  'CR': 'Croydon',
  'DA': 'Dartford',
  'EN': 'Enfield',
  'HA': 'Harrow',
  'IG': 'Ilford',
  'KT': 'Kingston',
  'RM': 'Romford',
  'SM': 'Sutton',
  'TW': 'Twickenham',
  'UB': 'Uxbridge',
  'WD': 'Watford',
};

const getPostcodeArea = (postcode: string): string => {
  const match = postcode.toUpperCase().match(/^([A-Z]{1,2})/);
  return match ? match[1] : 'Unknown';
};

const getRegionName = (postcode: string): string => {
  const area = getPostcodeArea(postcode);
  return POSTCODE_REGIONS[area] || area;
};

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: 'bg-destructive text-destructive-foreground', order: 1 },
  high: { label: 'High', color: 'bg-warning text-warning-foreground', order: 2 },
  medium: { label: 'Medium', color: 'bg-primary/20 text-primary', order: 3 },
  low: { label: 'Low', color: 'bg-muted text-muted-foreground', order: 4 },
};

export function JobScheduler({ jobs, onScheduleJob }: JobSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workDayHours, setWorkDayHours] = useState(8);
  const [open, setOpen] = useState(false);

  // Group jobs by postcode region for geographic optimization
  const jobsByRegion = useMemo(() => {
    const grouped: Record<string, ScheduledJob[]> = {};
    jobs.forEach(job => {
      const region = getRegionName(job.postcode);
      if (!grouped[region]) grouped[region] = [];
      grouped[region].push(job);
    });
    return grouped;
  }, [jobs]);

  // Calculate optimal route for a given day
  const optimizedSchedule = useMemo(() => {
    // Sort by priority first, then group by region
    const pendingJobs = jobs
      .filter(j => j.status === 'pending' || j.status === 'scheduled')
      .sort((a, b) => {
        // Priority first
        const priorityDiff = PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
        if (priorityDiff !== 0) return priorityDiff;
        // Then by region (to minimize travel)
        return getPostcodeArea(a.postcode).localeCompare(getPostcodeArea(b.postcode));
      });

    let totalHours = 0;
    const daySchedule: (ScheduledJob & { startTime: string; travelTime: number })[] = [];
    let currentHour = 8; // Start at 8am

    pendingJobs.forEach(job => {
      if (totalHours + job.estimatedHours <= workDayHours) {
        // Estimate travel time based on same/different region
        const lastJob = daySchedule[daySchedule.length - 1];
        const travelTime = lastJob 
          ? (getPostcodeArea(lastJob.postcode) === getPostcodeArea(job.postcode) ? 0.25 : 0.75)
          : 0;
        
        const startHour = currentHour + travelTime;
        daySchedule.push({
          ...job,
          startTime: `${Math.floor(startHour)}:${Math.round((startHour % 1) * 60).toString().padStart(2, '0')}`,
          travelTime,
        });
        
        currentHour = startHour + job.estimatedHours;
        totalHours += job.estimatedHours + travelTime;
      }
    });

    return {
      jobs: daySchedule,
      totalHours: totalHours.toFixed(1),
      utilizationPercent: Math.round((totalHours / workDayHours) * 100),
      regionsVisited: [...new Set(daySchedule.map(j => getRegionName(j.postcode)))],
    };
  }, [jobs, workDayHours]);

  // Calculate overall stats
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const totalHours = jobs.reduce((sum, j) => sum + j.estimatedHours, 0);
    const pendingJobs = jobs.filter(j => j.status === 'pending').length;
    const daysRequired = Math.ceil(totalHours / workDayHours);
    const urgentJobs = jobs.filter(j => j.priority === 'urgent' || j.priority === 'high').length;

    return { totalJobs, totalHours, pendingJobs, daysRequired, urgentJobs };
  }, [jobs, workDayHours]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Jobs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Job Scheduler & Route Optimizer
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 pb-4">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{stats.totalJobs}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{stats.totalHours}h</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingJobs}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Days Required</p>
                <p className="text-2xl font-bold">{stats.daysRequired}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Urgent/High</p>
                <p className="text-2xl font-bold text-warning">{stats.urgentJobs}</p>
              </Card>
            </div>

            {/* Schedule Settings */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Schedule Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Schedule Date</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="h-8 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Work Day Hours</Label>
                    <Input
                      type="number"
                      value={workDayHours}
                      onChange={e => setWorkDayHours(parseInt(e.target.value) || 8)}
                      className="h-8 mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimized Schedule */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Optimized Schedule for {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{optimizedSchedule.totalHours}h booked</Badge>
                    <Badge className={optimizedSchedule.utilizationPercent >= 80 ? 'bg-green-500' : 'bg-warning'}>
                      {optimizedSchedule.utilizationPercent}% utilization
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {optimizedSchedule.jobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No jobs to schedule. Add jobs to see optimized route.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {/* Regions to visit */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Route covers:</span>
                      {optimizedSchedule.regionsVisited.map(region => (
                        <Badge key={region} variant="secondary" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>

                    {/* Job timeline */}
                    <div className="relative pl-6 border-l-2 border-primary/30 space-y-4">
                      {optimizedSchedule.jobs.map((job, idx) => (
                        <div key={job.id} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-[10px] text-primary-foreground font-bold">{idx + 1}</span>
                          </div>
                          
                          <Card className="ml-2">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="text-xs">
                                      {job.startTime}
                                    </Badge>
                                    <Badge className={PRIORITY_CONFIG[job.priority].color + " text-xs"}>
                                      {PRIORITY_CONFIG[job.priority].label}
                                    </Badge>
                                    {job.travelTime > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        +{Math.round(job.travelTime * 60)}min travel
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-medium text-sm mt-1 truncate">{job.jobDescription}</p>
                                  <p className="text-xs text-muted-foreground">{job.customerName}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground truncate">
                                      {job.customerAddress} ({job.postcode})
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-lg font-bold">{job.estimatedHours}h</p>
                                  <Badge variant="secondary" className="text-xs">{job.trade}</Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Jobs by Region */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Jobs by Geographic Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(jobsByRegion).map(([region, regionJobs]) => (
                    <div key={region} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{region}</span>
                        <Badge variant="outline">{regionJobs.length} jobs</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {regionJobs.reduce((sum, j) => sum + j.estimatedHours, 0)}h total work
                      </div>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {regionJobs.slice(0, 3).map(job => (
                          <Badge key={job.id} variant="secondary" className="text-[10px]">
                            {job.customerName.split(' ')[0]}
                          </Badge>
                        ))}
                        {regionJobs.length > 3 && (
                          <Badge variant="secondary" className="text-[10px]">
                            +{regionJobs.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Scheduling Tips
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Jobs are auto-sorted by priority, then grouped by area to minimize travel</li>
                  <li>• Travel time estimates: ~15min within same area, ~45min between areas</li>
                  <li>• Aim for 80%+ utilization - leave buffer for unexpected delays</li>
                  <li>• Group multiple small jobs in one area for efficiency</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
