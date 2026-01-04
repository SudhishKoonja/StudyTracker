"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Moon, Sun, ExternalLink, BookOpen, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ObjectiveCard } from "@/components/objective-card"
import { AddObjectiveDialog } from "@/components/add-objective-dialog"
import { StudyTimer } from "@/components/study-timer"
import { StatsOverview } from "@/components/stats-overview"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"

export interface Objective {
  id: string
  title: string
  description: string
  targetHours: number
  currentHours: number
  color: string
  createdAt: string
  subject?: "chemistry" | "physics" | "computer-science"
  chapter?: string
}

export default function Home() {
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null)
  const [isDark, setIsDark] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const unlocked = sessionStorage.getItem("unlocked") === "true"
    setIsUnlocked(unlocked)

    if (unlocked) {
      loadObjectives()
    }
    setIsLoading(false)

    const darkMode = localStorage.getItem("dark-mode") === "true"
    setIsDark(darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pinInput === "1408") {
      setIsUnlocked(true)
      sessionStorage.setItem("unlocked", "true")
      setPinError(false)
      loadObjectives()
    } else {
      setPinError(true)
      setPinInput("")
    }
  }

  const loadObjectives = async () => {
    const { data, error } = await supabase.from("objectives").select("*").order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Error loading objectives:", error)
      return
    }

    const mappedObjectives: Objective[] = (data || []).map((obj: any) => ({
      id: obj.id,
      title: obj.title,
      description: obj.description || "",
      targetHours: Number(obj.target_hours),
      currentHours: Number(obj.current_hours),
      color: obj.color,
      createdAt: obj.created_at,
      subject: obj.subject,
      chapter: obj.chapter,
    }))

    setObjectives(mappedObjectives)
  }

  const toggleDarkMode = () => {
    const newMode = !isDark
    setIsDark(newMode)
    localStorage.setItem("dark-mode", String(newMode))
    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const addObjective = async (objective: Omit<Objective, "id" | "createdAt" | "currentHours">) => {
    const { data, error } = await supabase
      .from("objectives")
      .insert({
        title: objective.title,
        description: objective.description,
        target_hours: objective.targetHours,
        current_hours: 0,
        color: objective.color,
        subject: objective.subject,
        chapter: objective.chapter,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding objective:", error)
      return
    }

    await loadObjectives()
  }

  const updateObjective = async (id: string, updates: Partial<Objective>) => {
    const dbUpdates: any = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.targetHours !== undefined) dbUpdates.target_hours = updates.targetHours
    if (updates.currentHours !== undefined) dbUpdates.current_hours = updates.currentHours
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.subject !== undefined) dbUpdates.subject = updates.subject
    if (updates.chapter !== undefined) dbUpdates.chapter = updates.chapter

    const { error } = await supabase.from("objectives").update(dbUpdates).eq("id", id)

    if (error) {
      console.error("[v0] Error updating objective:", error)
      return
    }

    await loadObjectives()
  }

  const deleteObjective = async (id: string) => {
    const { error } = await supabase.from("objectives").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting objective:", error)
      return
    }

    if (selectedObjective?.id === id) {
      setSelectedObjective(null)
    }

    await loadObjectives()
  }

  const addStudyTime = async (id: string, hours: number) => {
    const objective = objectives.find((obj) => obj.id === id)
    if (!objective) return

    const { error: sessionError } = await supabase.from("study_sessions").insert({
      objective_id: id,
      duration_hours: hours,
      session_date: new Date().toISOString().split("T")[0],
    })

    if (sessionError) {
      console.error("[v0] Error creating study session:", sessionError)
    }

    await updateObjective(id, {
      currentHours: objective.currentHours + hours,
    })
  }

  const getSyllabusUrl = (subject?: string) => {
    const syllabusUrls = {
      chemistry: "https://www.cambridgeinternational.org/Images/597427-2025-2027-syllabus.pdf",
      physics: "https://www.cambridgeinternational.org/Images/597506-2025-2027-syllabus.pdf",
      "computer-science": "https://www.cambridgeinternational.org/Images/597401-2025-2027-syllabus.pdf",
    }
    return subject && subject in syllabusUrls
      ? syllabusUrls[subject as keyof typeof syllabusUrls]
      : "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-advanced/cambridge-international-as-and-a-levels/"
  }

  const autoPopulateObjectives = async () => {
    if (objectives.length > 0) return

    const defaultObjectives = [
      // Chemistry A Level
      { title: "Atomic Structure", subject: "chemistry", chapter: "1. Atomic structure", color: "#3b82f6" },
      { title: "Electrons in Atoms", subject: "chemistry", chapter: "2. Electrons in atoms", color: "#3b82f6" },
      { title: "Chemical Bonding", subject: "chemistry", chapter: "3. Chemical bonding", color: "#3b82f6" },
      { title: "States of Matter", subject: "chemistry", chapter: "4. States of matter", color: "#3b82f6" },
      { title: "Chemical Energetics", subject: "chemistry", chapter: "5. Chemical energetics", color: "#3b82f6" },
      { title: "Electrochemistry", subject: "chemistry", chapter: "6. Electrochemistry", color: "#3b82f6" },
      { title: "Equilibria", subject: "chemistry", chapter: "7. Equilibria", color: "#3b82f6" },
      { title: "Reaction Kinetics", subject: "chemistry", chapter: "8. Reaction kinetics", color: "#3b82f6" },
      { title: "The Periodic Table", subject: "chemistry", chapter: "9. The Periodic table", color: "#3b82f6" },
      { title: "Group 2", subject: "chemistry", chapter: "10. Group 2", color: "#3b82f6" },
      { title: "Group 17", subject: "chemistry", chapter: "11. Group 17", color: "#3b82f6" },
      { title: "Nitrogen and Sulfur", subject: "chemistry", chapter: "12. Nitrogen and sulfur", color: "#3b82f6" },
      {
        title: "Introduction to Organic Chemistry",
        subject: "chemistry",
        chapter: "13. Introduction to organic chemistry",
        color: "#3b82f6",
      },
      { title: "Hydrocarbons", subject: "chemistry", chapter: "14. Hydrocarbons", color: "#3b82f6" },
      { title: "Halogen Compounds", subject: "chemistry", chapter: "15. Halogen compounds", color: "#3b82f6" },
      { title: "Hydroxy Compounds", subject: "chemistry", chapter: "16. Hydroxy compounds", color: "#3b82f6" },
      { title: "Carbonyl Compounds", subject: "chemistry", chapter: "17. Carbonyl compounds", color: "#3b82f6" },
      { title: "Carboxylic Acids", subject: "chemistry", chapter: "18. Carboxylic acids", color: "#3b82f6" },
      { title: "Nitrogen Compounds", subject: "chemistry", chapter: "19. Nitrogen compounds", color: "#3b82f6" },
      { title: "Polymerisation", subject: "chemistry", chapter: "20. Polymerisation", color: "#3b82f6" },
      { title: "Analytical Techniques", subject: "chemistry", chapter: "21. Analytical techniques", color: "#3b82f6" },
      { title: "Organic Synthesis", subject: "chemistry", chapter: "22. Organic synthesis", color: "#3b82f6" },

      // Physics A Level
      {
        title: "Physical Quantities",
        subject: "physics",
        chapter: "1. Physical quantities and units",
        color: "#8b5cf6",
      },
      { title: "Kinematics", subject: "physics", chapter: "2. Kinematics", color: "#8b5cf6" },
      { title: "Dynamics", subject: "physics", chapter: "3. Dynamics", color: "#8b5cf6" },
      {
        title: "Forces, Density and Pressure",
        subject: "physics",
        chapter: "4. Forces, density and pressure",
        color: "#8b5cf6",
      },
      { title: "Work, Energy and Power", subject: "physics", chapter: "5. Work, energy and power", color: "#8b5cf6" },
      { title: "Momentum", subject: "physics", chapter: "6. Momentum", color: "#8b5cf6" },
      { title: "Matter and Materials", subject: "physics", chapter: "7. Matter and materials", color: "#8b5cf6" },
      { title: "Electric Fields", subject: "physics", chapter: "8. Electric fields", color: "#8b5cf6" },
      { title: "Current of Electricity", subject: "physics", chapter: "9. Current of electricity", color: "#8b5cf6" },
      { title: "D.C. Circuits", subject: "physics", chapter: "10. D.C. circuits", color: "#8b5cf6" },
      { title: "Particle Physics", subject: "physics", chapter: "11. Particle physics", color: "#8b5cf6" },
      { title: "Waves", subject: "physics", chapter: "12. Waves", color: "#8b5cf6" },
      { title: "Superposition", subject: "physics", chapter: "13. Superposition", color: "#8b5cf6" },
      { title: "Electromagnetic Waves", subject: "physics", chapter: "14. Electromagnetic waves", color: "#8b5cf6" },
      { title: "Quantum Physics", subject: "physics", chapter: "15. Quantum physics", color: "#8b5cf6" },
      { title: "Circular Motion", subject: "physics", chapter: "16. Circular motion", color: "#8b5cf6" },
      { title: "Gravitational Fields", subject: "physics", chapter: "17. Gravitational fields", color: "#8b5cf6" },
      { title: "Temperature", subject: "physics", chapter: "18. Temperature", color: "#8b5cf6" },
      { title: "Ideal Gases", subject: "physics", chapter: "19. Ideal gases", color: "#8b5cf6" },
      { title: "Thermodynamics", subject: "physics", chapter: "20. Thermodynamics", color: "#8b5cf6" },
      { title: "Magnetic Fields", subject: "physics", chapter: "21. Magnetic fields", color: "#8b5cf6" },
      {
        title: "Electromagnetic Induction",
        subject: "physics",
        chapter: "22. Electromagnetic induction",
        color: "#8b5cf6",
      },
      { title: "Alternating Currents", subject: "physics", chapter: "23. Alternating currents", color: "#8b5cf6" },
      { title: "Nuclear Physics", subject: "physics", chapter: "24. Nuclear physics", color: "#8b5cf6" },
      { title: "Medical Physics", subject: "physics", chapter: "25. Medical physics", color: "#8b5cf6" },
      {
        title: "Astronomy and Cosmology",
        subject: "physics",
        chapter: "26. Astronomy and cosmology",
        color: "#8b5cf6",
      },

      // Computer Science AS Level
      {
        title: "Information Representation",
        subject: "computer-science",
        chapter: "1. Information representation",
        color: "#10b981",
      },
      { title: "Communication", subject: "computer-science", chapter: "2. Communication", color: "#10b981" },
      { title: "Hardware", subject: "computer-science", chapter: "3. Hardware", color: "#10b981" },
      {
        title: "Processor Fundamentals",
        subject: "computer-science",
        chapter: "4. Processor fundamentals",
        color: "#10b981",
      },
      { title: "System Software", subject: "computer-science", chapter: "5. System software", color: "#10b981" },
      { title: "Security", subject: "computer-science", chapter: "6. Security", color: "#10b981" },
      {
        title: "Ethics and Ownership",
        subject: "computer-science",
        chapter: "7. Ethics and ownership",
        color: "#10b981",
      },
      { title: "Databases", subject: "computer-science", chapter: "8. Databases", color: "#10b981" },
      {
        title: "Algorithm Design and Problem-Solving",
        subject: "computer-science",
        chapter: "9. Algorithm design and problem-solving",
        color: "#10b981",
      },
      {
        title: "Data Types and Structures",
        subject: "computer-science",
        chapter: "10. Data types and structures",
        color: "#10b981",
      },
      { title: "Programming", subject: "computer-science", chapter: "11. Programming", color: "#10b981" },
      {
        title: "Software Development",
        subject: "computer-science",
        chapter: "12. Software development",
        color: "#10b981",
      },
    ]

    for (const obj of defaultObjectives) {
      await supabase.from("objectives").insert({
        title: obj.title,
        description: `Study ${obj.chapter} from the CAIE syllabus`,
        target_hours: 10,
        current_hours: 0,
        color: obj.color,
        subject: obj.subject,
        chapter: obj.chapter,
      })
    }

    await loadObjectives()
  }

  useEffect(() => {
    if (isUnlocked && !isLoading) {
      autoPopulateObjectives()
    }
  }, [isUnlocked, isLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isUnlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-border/50">
              <Image
                src="/logo.png"
                alt="Sudhish Koonja"
                width={96}
                height={96}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Sudhish Koonja</h1>
              <p className="text-base font-medium text-primary">CAIE Study Progress Tracker</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/50 p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4 ring-1 ring-primary/20">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="pin" className="text-sm font-medium text-foreground">
                  Enter PIN to unlock
                </label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value)
                    setPinError(false)
                  }}
                  maxLength={4}
                  className={`text-center text-2xl tracking-widest ${
                    pinError ? "border-destructive ring-destructive/20" : ""
                  }`}
                  autoFocus
                />
                {pinError && <p className="text-sm text-destructive">Incorrect PIN. Please try again.</p>}
              </div>

              <Button type="submit" className="w-full" size="lg">
                Unlock
              </Button>
            </form>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={toggleDarkMode}
              size="icon"
              variant="outline"
              className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white p-2 shadow-lg ring-1 ring-border/50">
                  <Image
                    src="/logo.png"
                    alt="Sudhish Koonja"
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-5xl font-bold tracking-tight text-foreground">Sudhish Koonja</h1>
                  <p className="text-base font-medium text-primary">CAIE Study Progress Tracker</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                  Master your CAIE syllabus with intelligent tracking. Manage objectives, monitor progress with advanced
                  analytics, and optimize your study sessions using the integrated pomodoro timer.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Quick Links:</span>
                  </div>
                  <a
                    href={getSyllabusUrl("chemistry")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 backdrop-blur-sm transition-all hover:border-blue-500/50 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 dark:text-blue-400"
                  >
                    <span>Chemistry A Level</span>
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href={getSyllabusUrl("physics")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-600 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10 dark:text-purple-400"
                  >
                    <span>Physics A Level</span>
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href={getSyllabusUrl("computer-science")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-600 backdrop-blur-sm transition-all hover:border-green-500/50 hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/10 dark:text-green-400"
                  >
                    <span>Computer Science AS</span>
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <Button
                onClick={toggleDarkMode}
                size="icon"
                variant="outline"
                className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="lg"
                className="gap-2 rounded-xl bg-primary shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                <Plus className="h-5 w-5" />
                New Objective
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatsOverview objectives={objectives} />

        {selectedObjective && (
          <StudyTimer
            objective={selectedObjective}
            onClose={() => setSelectedObjective(null)}
            onTimeLogged={(hours) => addStudyTime(selectedObjective.id, hours)}
          />
        )}

        <div className="mt-8">
          {objectives.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border/60 bg-muted/30 p-20 text-center backdrop-blur-sm">
              <div className="mx-auto max-w-md space-y-5">
                <div className="mx-auto w-fit rounded-2xl bg-primary/10 p-5 ring-1 ring-primary/20">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">Start Your Journey</h3>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    Create your first study objective from the CAIE syllabus to begin tracking your academic progress
                    with precision analytics
                  </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} size="lg" className="mt-4 gap-2 shadow-lg">
                  <Plus className="h-5 w-5" />
                  Create Objective
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {objectives.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  onStartStudy={() => setSelectedObjective(objective)}
                  onUpdate={(updates) => updateObjective(objective.id, updates)}
                  onDelete={() => deleteObjective(objective.id)}
                />
              ))}
            </div>
          )}
        </div>

        <AddObjectiveDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAdd={addObjective} />
      </div>
    </main>
  )
}
