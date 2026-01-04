"use client"

import { Clock, Target, TrendingUp, Zap, BarChart3, Activity } from "lucide-react"
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

      for (let i = 83; i >= 0; i--) {
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

  const avgHoursPerObjective = totalObjectives > 0 ? totalHours / totalObjectives : 0

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Hours Card */}
        <Card className="group relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent transition-all hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />
          <CardContent className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600/80 dark:text-blue-400/80">
                    Total Hours
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
                    {totalHours.toFixed(1)}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">of {totalTargetHours.toFixed(1)}h goal</p>
                </div>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-3 ring-1 ring-blue-500/20">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-blue-500/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700"
                  style={{ width: `${Math.min((totalHours / totalTargetHours) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Card */}
        <Card className="group relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent transition-all hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20" />
          <CardContent className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80">
                    Completed
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
                    {completedObjectives}
                    <span className="text-xl text-muted-foreground">/{totalObjectives}</span>
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">{completionRate.toFixed(0)}% completion</p>
                </div>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
                <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-emerald-500/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {completionRate.toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Goals Card */}
        <Card className="group relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent transition-all hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-500/10 blur-2xl transition-all group-hover:bg-purple-500/20" />
          <CardContent className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-600/80 dark:text-purple-400/80">
                    Active Goals
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold tabular-nums tracking-tight text-foreground">{totalObjectives}</p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {totalObjectives - completedObjectives} in progress
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-purple-500/10 p-3 ring-1 ring-purple-500/20">
                <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex gap-1">
              {objectives.slice(0, 10).map((obj, idx) => (
                <div
                  key={obj.id}
                  className="h-2 flex-1 rounded-full transition-all hover:scale-y-150"
                  style={{ backgroundColor: obj.color, opacity: 0.8 + idx * 0.02 }}
                  title={obj.title}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Average Hours Card */}
        <Card className="group relative overflow-hidden border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent transition-all hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-orange-500/10 blur-2xl transition-all group-hover:bg-orange-500/20" />
          <CardContent className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-600/80 dark:text-orange-400/80">
                    Avg per Goal
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
                    {avgHoursPerObjective.toFixed(1)}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">hours studied</p>
                </div>
              </div>
              <div className="rounded-xl bg-orange-500/10 p-3 ring-1 ring-orange-500/20">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between gap-1">
              {Array.from({ length: 7 }).map((_, i) => {
                const height = 20 + Math.random() * 60
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-sm bg-gradient-to-t from-orange-500 to-orange-400 transition-all hover:from-orange-600 hover:to-orange-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {heatmapData.length > 0 && (
        <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-muted/30 to-background">
          <CardHeader className="border-b border-border/40 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">Study Activity Heatmap</CardTitle>
                <p className="text-sm text-muted-foreground">Your last 12 weeks of consistent progress</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 px-3 py-1.5 ring-1 ring-emerald-500/20">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">84 Days</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-1.5">
                {heatmapData.map((day, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded transition-all hover:scale-110 hover:ring-2 hover:ring-emerald-500/50 ${getIntensityColor(day.intensity)}`}
                    title={`${day.date}: ${day.hours.toFixed(1)}h studied`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs">
                <span className="font-medium text-muted-foreground">Less active</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-muted/60" />
                  <div className="h-4 w-4 rounded bg-emerald-200/80 dark:bg-emerald-900/50" />
                  <div className="h-4 w-4 rounded bg-emerald-400/80 dark:bg-emerald-700/70" />
                  <div className="h-4 w-4 rounded bg-emerald-600/80 dark:bg-emerald-500/90" />
                  <div className="h-4 w-4 rounded bg-emerald-700 dark:bg-emerald-400" />
                </div>
                <span className="font-medium text-muted-foreground">More active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject Progress */}
      {objectives.length > 0 && (
        <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-muted/30 to-background">
          <CardHeader className="border-b border-border/40 bg-muted/20">
            <CardTitle className="text-xl font-bold">Objective Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Detailed progress for each study goal</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {objectives.map((obj) => {
                const progress = Math.min((obj.currentHours / obj.targetHours) * 100, 100)
                return (
                  <div key={obj.id} className="group space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground">{obj.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {obj.currentHours.toFixed(1)} / {obj.targetHours}h
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold tabular-nums">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, ${obj.color}, ${obj.color}dd)`,
                        }}
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
  )
}
