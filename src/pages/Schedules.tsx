import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  Plus,
  GanttChart,
  Layers,
  CheckCircle,
} from "lucide-react";
import {
  TASK_TEMPLATES,
  TRADE_COLORS,
  calculateSchedule,
  formatGanttDate,
  getResourcesByDay,
  type ProjectTask,
} from "@/lib/schedules-module-data";
import { ExportButtons } from "@/components/shared/ExportButtons";

export default function Schedules() {
  const [projectType, setProjectType] = useState<string>("extension");
  const [projectStart, setProjectStart] = useState<Date>(new Date());
  const [customTasks, setCustomTasks] = useState<ProjectTask[]>([]);

  // Get tasks for selected project type
  const baseTasks = TASK_TEMPLATES[projectType] || TASK_TEMPLATES.extension;
  const allTasks = customTasks.length > 0 ? customTasks : baseTasks;

  // Calculate schedule
  const schedule = useMemo(() => calculateSchedule(allTasks), [allTasks]);

  // Day width for Gantt
  const dayWidth = 30;
  const chartWidth = schedule.projectDuration * dayWidth + 100;

  // Resources by day
  const resourcesByDay = useMemo(() => getResourcesByDay(schedule.tasks), [schedule.tasks]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <GanttChart className="h-6 w-6" />
              Project Schedules
            </h1>
            <p className="text-sm text-muted-foreground">
              Gantt charts, task dependencies & resource planning
            </p>
          </div>

          <div className="flex gap-3">
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="extension">Extension</SelectItem>
                <SelectItem value="loft">Loft Conversion</SelectItem>
                <SelectItem value="bathroom">Bathroom</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
              </SelectContent>
            </Select>

            <ExportButtons
              data={schedule.tasks.map(t => ({
                task_name: t.name,
                trade: t.trade,
                duration_days: t.duration,
                start_day: t.startDay || 1,
                end_day: t.endDay || t.duration,
                dependencies: t.dependencies.join(", "),
              }))}
              columns={[
                { key: "task_name", label: "Task", width: 150 },
                { key: "trade", label: "Trade", width: 100 },
                { key: "duration_days", label: "Duration (Days)", width: 80 },
                { key: "start_day", label: "Start Day", width: 60 },
                { key: "end_day", label: "End Day", width: 60 },
                { key: "dependencies", label: "Dependencies", width: 120 },
              ]}
              filename={`schedule-${projectType}`}
              title={`${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Schedule`}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-xl font-bold">{schedule.projectDuration} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                  <p className="text-xl font-bold">{schedule.tasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Users className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trades</p>
                  <p className="text-xl font-bold">
                    {new Set(schedule.tasks.map(t => t.trade)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Critical Path</p>
                  <p className="text-xl font-bold">{schedule.criticalPath.length} tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="gantt">
          <TabsList>
            <TabsTrigger value="gantt" className="gap-2">
              <GanttChart className="h-4 w-4" />
              Gantt Chart
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <Layers className="h-4 w-4" />
              Task List
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <Users className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gantt" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Project Timeline</span>
                  <div className="flex items-center gap-2 text-sm font-normal">
                    <Label className="text-xs">Start Date:</Label>
                    <Input
                      type="date"
                      className="w-40 h-8"
                      value={projectStart.toISOString().split('T')[0]}
                      onChange={(e) => setProjectStart(new Date(e.target.value))}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="min-w-[800px]" style={{ width: chartWidth }}>
                    {/* Timeline header */}
                    <div className="flex border-b mb-2 pb-2">
                      <div className="w-48 flex-shrink-0 font-medium text-sm">Task</div>
                      <div className="flex-1 flex">
                        {Array.from({ length: schedule.projectDuration }, (_, i) => (
                          <div
                            key={i}
                            className="text-xs text-center text-muted-foreground"
                            style={{ width: dayWidth }}
                          >
                            {(i + 1) % 5 === 0 ? formatGanttDate(i + 1, projectStart) : ''}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tasks */}
                    {schedule.tasks.map((task) => (
                      <div key={task.id} className="flex items-center h-10 hover:bg-muted/30">
                        <div className="w-48 flex-shrink-0 text-sm truncate pr-2" title={task.name}>
                          {task.name}
                        </div>
                        <div className="flex-1 relative h-6">
                          {/* Grid lines */}
                          <div className="absolute inset-0 flex">
                            {Array.from({ length: schedule.projectDuration }, (_, i) => (
                              <div
                                key={i}
                                className="border-r border-muted/30"
                                style={{ width: dayWidth }}
                              />
                            ))}
                          </div>

                          {/* Task bar */}
                          <div
                            className="absolute h-full rounded-md flex items-center justify-center text-xs text-white font-medium"
                            style={{
                              left: ((task.startDay || 1) - 1) * dayWidth,
                              width: task.duration * dayWidth - 4,
                              backgroundColor: task.color,
                            }}
                          >
                            {task.duration >= 3 && task.duration + 'd'}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Week markers */}
                    <div className="flex mt-4 pt-2 border-t">
                      <div className="w-48 flex-shrink-0" />
                      <div className="flex-1 flex">
                        {Array.from({ length: Math.ceil(schedule.projectDuration / 5) }, (_, week) => (
                          <div
                            key={week}
                            className="text-xs text-muted-foreground font-medium"
                            style={{ width: dayWidth * 5 }}
                          >
                            Week {week + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Trade Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(TRADE_COLORS).slice(0, 12).map(([trade, color]) => (
                    <div key={trade} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs">{trade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Task Dependencies
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedule.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-3 h-12 rounded-full"
                          style={{ backgroundColor: task.color }}
                        />
                        <div>
                          <p className="font-medium">{task.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{task.trade}</Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.duration} days
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">
                          Day {task.startDay} - Day {task.endDay}
                        </p>
                        {task.dependencies.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            After: {task.dependencies.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Trade summary */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Array.from(new Set(schedule.tasks.map(t => t.trade))).map(trade => {
                      const tradeTasks = schedule.tasks.filter(t => t.trade === trade);
                      const totalDays = tradeTasks.reduce((sum, t) => sum + t.duration, 0);
                      return (
                        <div key={trade} className="p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: TRADE_COLORS[trade] }}
                            />
                            <span className="font-medium text-sm">{trade}</span>
                          </div>
                          <p className="text-lg font-bold">{totalDays} days</p>
                          <p className="text-xs text-muted-foreground">
                            {tradeTasks.length} task(s)
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Equipment needs */}
                  <div>
                    <h4 className="font-medium mb-2">Equipment & Plant Required</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(schedule.tasks.flatMap(t => t.resources))).filter(Boolean).map(resource => (
                        <Badge key={resource} variant="secondary">
                          {resource}
                        </Badge>
                      ))}
                      {schedule.tasks.flatMap(t => t.resources).filter(Boolean).length === 0 && (
                        <p className="text-sm text-muted-foreground">No special equipment required</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> Schedules are estimates based on typical project durations.
              Actual timescales depend on site conditions, weather, material availability, and
              coordination with trades. Always allow contingency time for unforeseen delays.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
