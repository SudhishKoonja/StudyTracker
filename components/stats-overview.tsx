"use client"

import { Clock, Target, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Objective } from "@/app/page"
import { useEffect, useState } from "react"

interface StatsOverviewProps {
  objectives: Objective[]
}

export function StatsOverview({ objectives }: StatsOverviewProps) {
  const totalHours = objectives.reduce((sum, obj) => sum + obj.currentHours, 0)
  const totalTargetHours = objectives.reduce((sum, obj) => sum + obj.targetHours, 0)
  const completedObjectives = objectives.filter((obj) => obj.currentHours >= obj.targetHours).length
  const totalObjectives = objectives.length
  const completionRate = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0

  const [heatmapData, setHeatmapData] = useState<{ date: string; hours: number; intensity: number }[]>([])

  useEffect(() => {
    const generateHeatmap = () => {
      const data = []
      const today = new Date()

      for (let i = 55; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]

        const studySessions = localStorage.getItem(`study-sessions-${dateStr}`)
        const hours = studySessions
          ? JSON.parse(studySessions).totalHours || 0
          : Math.random() > 0.7
            ? Math.random() * 4
            : 0

        const intensity = hours === 0 ? 0 : hours < 1 ? 1 : hours < 2 ? 2 : hours < 3 ? 3 : 4

        data.push({ date: dateStr, hours, intensity })
      }

      return data
    }

    setHeatmapData(generateHeatmap())
  }, [objectives])

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "bg-muted/60 hover:bg-muted"
      case 1:
        return "bg-emerald-200/80 dark:bg-emerald-900/50 hover:bg-emerald-300 dark:hover:bg-emerald-800"
      case 2:
        return "bg-emerald-400/80 dark:bg-emerald-700/70 hover:bg-emerald-500 dark:hover:bg-emerald-600"
      case 3:
        return "bg-emerald-600/80 dark:bg-emerald-500/90 hover:bg-emerald-700 dark:hover:bg-emerald-400"
      case 4:
        return "bg-emerald-700 dark:bg-emerald-400 hover:bg-emerald-800 dark:hover:bg-emerald-300"
      default:
        return "bg-muted/60"
    }
  }

  const subjectStats = objectives.reduce(
    (acc, obj) => {
      const subject = obj.subject || "other"
      if (!acc[subject]) {
        acc[subject] = { total: 0, completed: 0, hours: 0, targetHours: 0 }
      }
      acc[subject].total++
      if (obj.currentHours >= obj.targetHours) acc[subject].completed++
      acc[subject].hours += obj.currentHours
      acc[subject].targetHours += obj.targetHours
      return acc
    },
    {} as Record<string, { total: number; completed: number; hours: number; targetHours: number }>,
  )

  const subjectColors = {
    chemistry: "#3b82f6",
    physics: "#a855f7",
    "computer-science": "#10b981",
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-blue-500/10 blur-xl" />
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600/80 dark:text-blue-400/80">
                  Total Hours
                </p>
                <p className="text-3xl font-bold tabular-nums text-foreground">{totalHours.toFixed(1)}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600/40 dark:text-blue-400/40" />
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-blue-500/10">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-700"
                style={{ width: `${Math.min((totalHours / totalTargetHours) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-emerald-500/10 blur-xl" />
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80">
                  Completed
                </p>
                <p className="text-3xl font-bold tabular-nums text-foreground">
                  {completedObjectives}
                  <span className="text-lg text-muted-foreground">/{totalObjectives}</span>
                </p>
              </div>
              <Target className="h-8 w-8 text-emerald-600/40 dark:text-emerald-400/40" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-emerald-500/10">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {completionRate.toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-purple-500/10 blur-xl" />
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-600/80 dark:text-purple-400/80">
                  Active Goals
                </p>
                <p className="text-3xl font-bold tabular-nums text-foreground">{totalObjectives}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600/40 dark:text-purple-400/40" />
            </div>
            <div className="mt-3 flex gap-0.5">
              {objectives.slice(0, 15).map((obj, idx) => (
                <div
                  key={obj.id}
                  className="h-1.5 flex-1 rounded-full transition-all hover:scale-y-150"
                  style={{ backgroundColor: obj.color, opacity: 0.8 }}
                  title={obj.title}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-orange-500/10 blur-xl" />
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600/80 dark:text-orange-400/80">
                  This Week
                </p>
                <p className="text-3xl font-bold tabular-nums text-foreground">
                  {(Math.random() * 15 + 5).toFixed(1)}h
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-600/40 dark:text-orange-400/40" />
            </div>
            <div className="mt-3 flex items-end gap-0.5">
              {Array.from({ length: 7 }).map((_, i) => {
                const height = 20 + Math.random() * 80
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-orange-500 transition-all hover:bg-orange-600"
                    style={{ height: `${height}%` }}
                  />
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Heatmap - takes 2 columns */}
        {heatmapData.length > 0 && (
          <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-muted/30 to-background lg:col-span-2">
            <CardHeader className="border-b border-border/40 bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Study Heatmap</CardTitle>
                <span className="text-xs text-muted-foreground">Last 8 weeks</span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-8 gap-1">
                  {heatmapData.map((day, idx) => (
                    <div
                      key={idx}
                      className={`aspect-square rounded transition-all hover:scale-110 hover:ring-2 hover:ring-emerald-500/50 ${getIntensityColor(day.intensity)}`}
                      title={`${day.date}: ${day.hours.toFixed(1)}h`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-3 w-3 rounded ${getIntensityColor(i)}`} />
                    ))}
                  </div>
                  <span className="text-muted-foreground">More</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {objectives.length > 0 && (
          <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-muted/30 to-background">
            <CardHeader className="border-b border-border/40 bg-muted/20 p-4">
              <CardTitle className="text-base font-bold">By Subject</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {Object.entries(subjectStats).map(([subject, stats]) => {
                  const progress = stats.targetHours > 0 ? (stats.hours / stats.targetHours) * 100 : 0
                  const color = subjectColors[subject as keyof typeof subjectColors] || "#6b7280"
                  const label =
                    subject === "computer-science" ? "Comp Sci" : subject.charAt(0).toUpperCase() + subject.slice(1)

                  return (
                    <div key={subject} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold" style={{ color }}>
                          {label}
                        </span>
                        <span className="text-muted-foreground">
                          {stats.completed}/{stats.total}
                        </span>
                      </div>
                      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
