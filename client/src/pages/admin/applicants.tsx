"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { ArrowLeft, Mail, Phone, Linkedin } from "lucide-react"
import { Link } from "react-router-dom"

interface Application {
  id: string
  jobId: string
  fullName: string
  email: string
  phone: string
  linkedin?: string
  education: Array<{
    school: string
    degree: string
    year: string
  }>
  experience: Array<{
    company: string
    role: string
    duration: string
    description: string
  }>
  skills: string[]
  coverLetter: string
  submittedAt: string
}

interface Job {
  id: string
  title: string
}

export default function ApplicantDetail() {
  const [application, setApplication] = useState<Application | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const params = useParams()
  const applicationId = params.id as string

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      navigate("/admin/login")
      return
    }

    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    const foundApplication = applications.find((app: Application) => app.id === applicationId)

    if (!foundApplication) {
      navigate("/admin/dashboard")
      return
    }

    setApplication(foundApplication)

    // Load job details
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
    const foundJob = jobs.find((j: Job) => j.id === foundApplication.jobId)
    setJob(foundJob)

    setLoading(false)
  }, [navigate, applicationId])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!application) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Application not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={job ? `/admin/jobs/${job.id}/applicants` : "/admin/dashboard"}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Applicants
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{application.fullName}</h1>
              {job && <p className="text-gray-600">Applied for: {job.title}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{application.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{application.phone}</span>
                </div>
                {application.linkedin && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-gray-500" />
                    <a
                      href={application.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {application.linkedin}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.school}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {application.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-green-200 pl-4">
                      <h4 className="font-semibold">{exp.role}</h4>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                      <p className="text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter / Personal Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{application.coverLetter}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Application Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-medium">{new Date(application.submittedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Education Entries</p>
                  <p className="font-medium">{application.education.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Work Experience</p>
                  <p className="font-medium">{application.experience.length} positions</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skills Listed</p>
                  <p className="font-medium">{application.skills.length}</p>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
