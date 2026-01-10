import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Calendar,
  Plus,
  Clock,
  Users,
  ChevronRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
} from "lucide-react";

// Trade colors for Gantt chart
const TRADE_COLORS: Record<string, string> = {
  groundworks: "bg-amber-500",
  foundations: "bg-stone-500",
  structural: "bg-red-500",
  brickwork: "bg-orange-500",
  roofing: "bg-slate-500",
  plumbing: "bg-blue-500",
  electrical: "bg-yellow-500",
  plastering: "bg-pink-500",
  carpentry: "bg-emerald-500",
  decorating: "bg-purple-500",
  landscaping: "bg-green-500",
  default: "bg-primary",
};

// Sample project schedule template
const EXTENSION_SCHEDULE_TEMPLATE = [
  { task: "Site setup & excavation", trade: "groundworks", duration: 3, dependencies: [], critical: true },
  { task: "Foundations", trade: "foundations", duration: 5, dependencies: ["Site setup & excavation"], critical: true },
  { task: "Ground floor slab", trade: "foundations", duration: 2, dependencies: ["Foundations"], critical: true },
  { task: "Brickwork to DPC", trade: "brickwork", duration: 3, dependencies: ["Ground floor slab"], critical: true },
  { task: "Brickwork to first floor", trade: "brickwork", duration: 5, dependencies: ["Brickwork to DPC"], critical: true },
  { task: "First floor joists & decking", trade: "carpentry", duration: 2, dependencies: ["Brickwork to first floor"], critical: true },
  { task: "Brickwork to eaves", trade: "brickwork", duration: 4, dependencies: ["First floor joists & decking"], critical: true },
  { task: "Roof structure", trade: "roofing", duration: 3, dependencies: ["Brickwork to eaves"], critical: true },
  { task: "Roof covering", trade: "roofing", duration: 4, dependencies: ["Roof structure"], critical: true },
  { task: "Windows & external doors", trade: "carpentry", duration: 2, dependencies: ["Roof covering"], critical: false },
  { task: "First fix plumbing", trade: "plumbing", duration: 3, dependencies: ["Roof covering"], critical: false },
  { task: "First fix electrical", trade: "electrical", duration: 3, dependencies: ["Roof covering"], critical: false },
  { task: "Insulation", trade: "structural", duration: 2, dependencies: ["First fix plumbing", "First fix electrical"], critical: false },
  { task: "Plasterboard & skim", trade: "plastering", duration: 5, dependencies: ["Insulation"], critical: true },
  { task: "Second fix carpentry", trade: "carpentry", duration: 3, dependencies: ["Plasterboard & skim"], critical: false },
  { task: "Second fix plumbing", trade: "plumbing", duration: 2, dependencies: ["Plasterboard & skim"], critical: false },
  { task: "Second fix electrical", trade: "electrical", duration: 2, dependencies: ["Plasterboard & skim"], critical: false },
  { task: "Kitchen installation", trade: "carpentry", duration: 3, dependencies: ["Second fix plumbing", "Second fix electrical"], critical: false },
  { task: "Decoration", trade: "decorating", duration: 5, dependencies: ["Second fix carpentry"], critical: false },
  { task: "Flooring", trade: "carpentry", duration: 2, dependencies: ["Decoration"], critical: false },
  { task: "External works", trade: "landscaping", duration: 3, dependencies: ["Windows & external doors"], critical: false },
  { task: "Snagging & handover", trade: "default", duration: 2, dependencies: ["Decoration", "Flooring", "External works"], critical: true },
];

interface ScheduleTask {
  id: string;
  task: string;
  trade: string;
  duration: number;
  startDay: number;
  endDay: number;
  dependencies: string[];
  status: "pending" | "in_progress" | "completed";
  critical: boolean;
}

export default function Schedules() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("New Extension Project");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [tasks, setTasks] = useState<ScheduleTask[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // New task form
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskTrade, setNewTaskTrade] = useState("default");
  const [newTaskDuration, setNewTaskDuration] = useState(1);
  const [newTaskDependencies, setNewTaskDependencies] = useState<string[]>([]);

  const calculateSchedule = (templateTasks: typeof EXTENSION_SCHEDULE_TEMPLATE) => {
    const scheduled: ScheduleTask[] = [];
    const taskStartDays: Record<string, number> = {};

    templateTasks.forEach((task, idx) => {
      let startDay = 1;
      
      // Find latest end day of dependencies
      task.dependencies.forEach(dep => {
        const depTask = scheduled.find(t => t.task === dep);
        if (depTask && depTask.endDay >= startDay) {
          startDay = depTask.endDay + 1;
        }
      });

      const scheduledTask: ScheduleTask = {
        id: `task-${idx}`,
        task: task.task,
        trade: task.trade,
        duration: task.duration,
        startDay,
        endDay: startDay + task.duration - 1,
        dependencies: task.dependencies,
        status: "pending",
        critical: task.critical,
      };

      scheduled.push(scheduledTask);
      taskStartDays[task.task] = startDay;
    });

    return scheduled;
  };

  useEffect(() => {
    const scheduled = calculateSchedule(EXTENSION_SCHEDULE_TEMPLATE);
    setTasks(scheduled);
  }, []);

  const totalDays = Math.max(...tasks.map(t => t.endDay), 0);
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const progressPercent = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const updateTaskStatus = (taskId: string, status: ScheduleTask["status"]) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status } : t
    ));
    toast.success(`Task updated to ${status.replace("_", " ")}`);
  };

  const addTask = () => {
    if (!newTaskName) {
      toast.error("Task name is required");
      return;
    }

    let startDay = 1;
    newTaskDependencies.forEach(depId => {
      const dep = tasks.find(t => t.id === depId);
      if (dep && dep.endDay >= startDay) {
        startDay = dep.endDay + 1;
      }
    });

    const newTask: ScheduleTask = {
      id: `task-${Date.now()}`,
      task: newTaskName,
      trade: newTaskTrade,
      duration: newTaskDuration,
      startDay,
      endDay: startDay + newTaskDuration - 1,
      dependencies: newTaskDependencies,
      status: "pending",
      critical: false,
    };

    setTasks(prev => [...prev, newTask]);
    setDialogOpen(false);
    setNewTaskName("");
    setNewTaskDuration(1);
    setNewTaskDependencies([]);
    toast.success("Task added");
  };

  const getDateForDay = (day: number) => {
    const date = new Date(startDate);
    // Skip weekends
    let workDays = 0;
    while (workDays < day - 1) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        workDays++;
      }
    }
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  // Calculate weeks for Gantt header
  const weeks = Math.ceil(totalDays / 5);
  const ganttScale = 100 / totalDays;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Project Schedules
            </h1>
            <p className="text-sm text-muted-foreground">
              Gantt charts with task dependencies and critical path
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Task Name *</Label>
                  <Input
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="e.g., Install kitchen cabinets"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Trade</Label>
                    <Select value={newTaskTrade} onValueChange={setNewTaskTrade}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(TRADE_COLORS).map(trade => (
                          <SelectItem key={trade} value={trade}>
                            {trade.charAt(0).toUpperCase() + trade.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration (days)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newTaskDuration}
                      onChange={(e) => setNewTaskDuration(parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Dependencies</Label>
                  <Select 
                    value={newTaskDependencies[0] || ""} 
                    onValueChange={(v) => setNewTaskDependencies([v])}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select predecessor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {tasks.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.task}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addTask} className="w-full">
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Duration</p>
                  <p className="text-xl font-bold">{totalDays} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-xl font-bold">{progressPercent.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedTasks} of {tasks.length} tasks complete
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <div className="flex gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span>Pending: {tasks.length - completedTasks - inProgressTasks}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span>In Progress: {inProgressTasks}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>Completed: {completedTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gantt Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Gantt Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="min-w-[800px]">
                {/* Week Headers */}
                <div className="flex border-b mb-2 pb-2">
                  <div className="w-48 flex-shrink-0 text-sm font-medium">Task</div>
                  <div className="flex-1 flex">
                    {Array.from({ length: weeks + 1 }, (_, i) => (
                      <div key={i} className="flex-1 text-xs text-muted-foreground text-center">
                        Week {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-1">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center group">
                      <div className="w-48 flex-shrink-0 pr-2">
                        <div className="flex items-center gap-2">
                          {task.critical && (
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                          )}
                          <span className="text-sm truncate">{task.task}</span>
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">{task.trade}</span>
                      </div>
                      <div className="flex-1 h-8 relative bg-muted/30 rounded">
                        {/* Grid lines */}
                        {Array.from({ length: weeks }, (_, i) => (
                          <div
                            key={i}
                            className="absolute top-0 bottom-0 border-l border-dashed border-muted-foreground/20"
                            style={{ left: `${((i + 1) * 5 / totalDays) * 100}%` }}
                          />
                        ))}
                        {/* Task bar */}
                        <div
                          className={`absolute top-1 bottom-1 rounded ${TRADE_COLORS[task.trade] || TRADE_COLORS.default} ${
                            task.status === "completed" ? "opacity-50" : ""
                          } ${task.status === "in_progress" ? "animate-pulse" : ""}`}
                          style={{
                            left: `${(task.startDay - 1) * ganttScale}%`,
                            width: `${task.duration * ganttScale}%`,
                          }}
                        />
                        {/* Dependency arrows would go here */}
                      </div>
                      <div className="w-24 flex-shrink-0 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {task.status === "pending" && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => updateTaskStatus(task.id, "in_progress")}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        {task.status === "in_progress" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => updateTaskStatus(task.id, "pending")}
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => updateTaskStatus(task.id, "completed")}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        {task.status === "completed" && (
                          <Badge variant="outline" className="text-xs">Done</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Trade Legend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trade Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(TRADE_COLORS).filter(([k]) => k !== "default").map(([trade, color]) => (
                <div key={trade} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${color}`} />
                  <span className="text-sm capitalize">{trade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    task.status === "completed" 
                      ? "bg-success/5 border-success/20" 
                      : task.status === "in_progress"
                      ? "bg-warning/5 border-warning/20"
                      : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${TRADE_COLORS[task.trade] || TRADE_COLORS.default}`} />
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {task.task}
                          {task.critical && (
                            <Badge variant="destructive" className="text-xs">Critical Path</Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Day {task.startDay} - Day {task.endDay} ({task.duration} days) • {task.trade}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.dependencies.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          After: {task.dependencies.join(", ")}
                        </span>
                      )}
                      <Select
                        value={task.status}
                        onValueChange={(v) => updateTaskStatus(task.id, v as ScheduleTask["status"])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
