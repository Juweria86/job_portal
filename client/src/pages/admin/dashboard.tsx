"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link} from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { PlusCircle, Users, Briefcase, LogOut } from "lucide-react"

interface Job {
  id: string
  title: string
  description: string
  deadline: string
  createdAt: string
}

interface Application {
  id: string
  jobId: string
  fullName: string
  email: string
  submittedAt: string
}

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const router = useNavigate()

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router("/login")
      return
    }

    // Load data from localStorage
    const savedJobs = localStorage.getItem("jobs")
    const savedApplications = localStorage.getItem("applications")

    if (savedJobs) {
      setJobs(JSON.parse(savedJobs))
    }
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router("/login")
  }

  const deleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId)
    setJobs(updatedJobs)
    localStorage.setItem("jobs", JSON.stringify(updatedJobs))

    // Also remove applications for this job
    const updatedApplications = applications.filter((app) => app.jobId !== jobId)
    setApplications(updatedApplications)
    localStorage.setItem("applications", JSON.stringify(updatedApplications))
  }

  const getApplicationCount = (jobId: string) => {
    return applications.filter((app) => app.jobId === jobId).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter((job) => new Date(job.deadline) > new Date()).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Job Postings</h2>
          <Link href="/admin/jobs/create">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Job
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">No jobs posted yet</p>
                <Link href="/admin/jobs/create">
                  <Button>Create Your First Job</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="mt-2">{job.description.substring(0, 150)}...</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={new Date(job.deadline) > new Date() ? "default" : "secondary"}>
                        {new Date(job.deadline) > new Date() ? "Active" : "Expired"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                      <p>Applications: {getApplicationCount(job.id)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/jobs/${job.id}/applicants`}>
                        <Button variant="outline" size="sm">
                          View Applicants ({getApplicationCount(job.id)})
                        </Button>
                      </Link>
                      <Link href={`/admin/jobs/edit/${job.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => deleteJob(job.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
