"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, X, Check, RotateCcw, Timer, PictureInPicture } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Objective } from "@/app/page"

interface StudyTimerProps {
  objective: Objective
  onClose: () => void
  onTimeLogged: (hours: number) => void
}

export function StudyTimer({ objective, onClose, onTimeLogged }: StudyTimerProps) {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25)
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0)
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false)
  const [pomodoroMode, setPomodoroMode] = useState<"work" | "break">("work")
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [isPiPMode, setIsPiPMode] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()
  const pomodoroIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  useEffect(() => {
    if (isPomodoroRunning) {
      pomodoroIntervalRef.current = setInterval(() => {
        setPomodoroSeconds((s) => {
          if (s === 0) {
            if (pomodoroMinutes === 0) {
              // Timer complete
              setIsPomodoroRunning(false)
              if (pomodoroMode === "work") {
                setCompletedPomodoros((c) => c + 1)
                // Auto switch to break
                setPomodoroMode("break")
                setPomodoroMinutes(5)
              } else {
                // Break complete, switch to work
                setPomodoroMode("work")
                setPomodoroMinutes(25)
              }
              return 0
            }
            setPomodoroMinutes((m) => m - 1)
            return 59
          }
          return s - 1
        })
      }, 1000)
    } else {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current)
      }
    }

    return () => {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current)
      }
    }
  }, [isPomodoroRunning, pomodoroMinutes, pomodoroMode])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleComplete = () => {
    const hours = seconds / 3600
    if (hours > 0) {
      onTimeLogged(hours)
    }
    onClose()
  }

  const resetPomodoro = () => {
    setIsPomodoroRunning(false)
    setPomodoroMode("work")
    setPomodoroMinutes(25)
    setPomodoroSeconds(0)
  }

  const togglePiP = () => {
    setIsPiPMode(!isPiPMode)
  }

  return (
    <div
      className={`${
        isPiPMode
          ? "fixed bottom-4 right-4 z-50 w-80"
          : "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      }`}
    >
      <Card className={`w-full ${isPiPMode ? "shadow-2xl" : "max-w-md"}`}>
        <CardHeader className="relative">
          <div className="absolute right-6 top-6 flex gap-2">
            <Button variant="ghost" size="icon" onClick={togglePiP}>
              <PictureInPicture className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <CardTitle className="text-balance pr-20">{objective.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="regular" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="regular">Regular Timer</TabsTrigger>
              <TabsTrigger value="pomodoro">
                <Timer className="mr-2 h-4 w-4" />
                Pomodoro
              </TabsTrigger>
            </TabsList>

            <TabsContent value="regular" className="space-y-6">
              <div className="rounded-lg bg-muted p-8 text-center">
                <div className="font-mono text-5xl font-bold tabular-nums text-foreground">{formatTime(seconds)}</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {seconds > 0 ? `${(seconds / 3600).toFixed(2)} hours` : "Press play to start"}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setIsRunning(!isRunning)}
                  size="lg"
                  className="flex-1 gap-2"
                  variant={isRunning ? "outline" : "default"}
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={handleComplete} size="lg" className="flex-1 gap-2" disabled={seconds === 0}>
                  <Check className="h-5 w-5" />
                  Complete
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="pomodoro" className="space-y-6">
              <div className="rounded-lg bg-muted p-8 text-center">
                <div className="mb-2 text-sm font-medium text-muted-foreground">
                  {pomodoroMode === "work" ? "Work Time" : "Break Time"}
                </div>
                <div className="font-mono text-5xl font-bold tabular-nums text-foreground">
                  {pomodoroMinutes.toString().padStart(2, "0")}:{pomodoroSeconds.toString().padStart(2, "0")}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Completed: {completedPomodoros} pomodoros</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                  size="lg"
                  className="flex-1 gap-2"
                  variant={isPomodoroRunning ? "outline" : "default"}
                >
                  {isPomodoroRunning ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={resetPomodoro} size="lg" variant="outline" className="gap-2 bg-transparent">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground">
            Progress: {objective.currentHours.toFixed(1)} / {objective.targetHours}h
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
