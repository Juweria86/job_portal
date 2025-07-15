"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { getJobById } from "../api/jobs" 

interface Job {
  _id: string
  title: string
  description: string
  deadline: string
}

interface Education {
  school: string
  degree: string
  year: string
}

interface Experience {
  company: string
  role: string
  duration: string
  description: string
}

export default function ApplyPage() {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useNavigate()
  const params = useParams()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    education: [{ school: "", degree: "", year: "" }] as Education[],
    experience: [{ company: "", role: "", duration: "", description: "" }] as Experience[],
    skills: [""] as string[],
    coverLetter: "",
  })

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      if (isMounted) {
        setError("Request timed out")
        setLoading(false)
      }
    }, 10000)

    const fetchJob = async () => {
      try {
        if (!params.id) {
          throw new Error("No job ID provided")
        }

        const data = await getJobById(params.id, { signal: controller.signal })
        
        if (!data) {
          throw new Error("Job not found")
        }

        if (isMounted) {
          setJob({
            ...data,
            id: data._id
          })
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch error:", err)
          setError(err.message)
          router("/jobs")
        }
      } finally {
        if (isMounted) {
          clearTimeout(timeoutId)
          setLoading(false)
        }
      }
    }

    fetchJob()

    return () => {
      isMounted = false
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [params.id, router])

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { school: "", degree: "", year: "" }],
    })
  }

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData({
        ...formData,
        education: formData.education.filter((_, i) => i !== index),
      })
    }
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = formData.education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    )
    setFormData({ ...formData, education: updated })
  }

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: "", role: "", duration: "", description: "" }],
    })
  }

  const removeExperience = (index: number) => {
    if (formData.experience.length > 1) {
      setFormData({
        ...formData,
        experience: formData.experience.filter((_, i) => i !== index),
      })
    }
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = formData.experience.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    )
    setFormData({ ...formData, experience: updated })
  }

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, ""],
    })
  }

  const removeSkill = (index: number) => {
    if (formData.skills.length > 1) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((_, i) => i !== index),
      })
    }
  }

  const updateSkill = (index: number, value: string) => {
    const updated = formData.skills.map((skill, i) => 
      i === index ? value : skill
    )
    setFormData({ ...formData, skills: updated })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const filteredSkills = formData.skills.filter(skill => skill.trim() !== "")

      const application = {
        id: Date.now().toString(),
        jobId: job?._id || params.id,
        ...formData,
        skills: filteredSkills,
        submittedAt: new Date().toISOString(),
      }

      const existingApplications = JSON.parse(localStorage.getItem("applications") || "[]")
      localStorage.setItem("applications", JSON.stringify([...existingApplications, application]))

      await new Promise(resolve => setTimeout(resolve, 1000))
      router("/apply/success")
    } catch (err) {
      console.error("Submission error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-black">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow max-w-md">
          <h2 className="text-xl font-bold text-black mb-2">Error</h2>
          <p className="text-black mb-4">{error}</p>
          <Button onClick={() => router("/jobs")}>Back to Jobs</Button>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow max-w-md">
          <h2 className="text-xl font-bold text-black mb-2">Job Not Found</h2>
          <Button onClick={() => router("/jobs")}>Back to Jobs</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/jobs">
              <Button variant="ghost" size="sm" className="text-black hover:text-black">
                <ArrowLeft className="w-4 h-4 mr-2 text-black" />
                Back to Jobs
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-black">Apply for Position</h1>
              <p className="text-black">{job.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 bg-white">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-black">{job.title}</CardTitle>
                  <p className="text-black mt-2">{job.description.substring(0, 200)}...</p>
                </div>
                <Badge className="text-black bg-gray-100">Deadline: {new Date(job.deadline).toLocaleDateString()}</Badge>
              </div>
            </CardHeader>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-black">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-black">Full Name *</Label>
                    <Input
                      id="fullName"
                      className="text-black border-gray-300"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-black">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      className="text-black border-gray-300"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-black">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      className="text-black border-gray-300"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin" className="text-black">LinkedIn Profile (Optional)</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      className="text-black border-gray-300"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-black">Education History</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addEducation} 
                    variant="outline" 
                    size="sm"
                    className="text-black"
                  >
                    <Plus className="w-4 h-4 mr-2 text-black" />
                    Add Education
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 relative">
                    {formData.education.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeEducation(index)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-black"
                      >
                        <X className="w-4 h-4 text-black" />
                      </Button>
                    )}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-black">School/University *</Label>
                        <Input
                          value={edu.school}
                          className="text-black border-gray-300"
                          onChange={(e) => updateEducation(index, "school", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-black">Degree *</Label>
                        <Input
                          value={edu.degree}
                          className="text-black border-gray-300"
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-black">Year *</Label>
                        <Input
                          value={edu.year}
                          className="text-black border-gray-300"
                          onChange={(e) => updateEducation(index, "year", e.target.value)}
                          placeholder="e.g. 2020 or 2018-2022"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-black">Work Experience</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addExperience} 
                    variant="outline" 
                    size="sm"
                    className="text-black"
                  >
                    <Plus className="w-4 h-4 mr-2 text-black" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 relative">
                    {formData.experience.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeExperience(index)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-black"
                      >
                        <X className="w-4 h-4 text-black" />
                      </Button>
                    )}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-black">Company *</Label>
                        <Input
                          value={exp.company}
                          className="text-black border-gray-300"
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-black">Role/Position *</Label>
                        <Input
                          value={exp.role}
                          className="text-black border-gray-300"
                          onChange={(e) => updateExperience(index, "role", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label className="text-black">Duration *</Label>
                      <Input
                        value={exp.duration}
                        className="text-black border-gray-300"
                        onChange={(e) => updateExperience(index, "duration", e.target.value)}
                        placeholder="e.g. Jan 2020 - Present or 2 years"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-black">Description *</Label>
                      <Textarea
                        value={exp.description}
                        className="text-black border-gray-300"
                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-black">Skills</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addSkill} 
                    variant="outline" 
                    size="sm"
                    className="text-black"
                  >
                    <Plus className="w-4 h-4 mr-2 text-black" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={skill}
                        className="text-black border-gray-300"
                        onChange={(e) => updateSkill(index, e.target.value)}
                        placeholder="e.g. JavaScript, Project Management"
                      />
                      {formData.skills.length > 1 && (
                        <Button 
                          type="button" 
                          onClick={() => removeSkill(index)} 
                          variant="ghost" 
                          size="sm"
                          className="text-black"
                        >
                          <X className="w-4 h-4 text-black" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-black">Cover Letter / Personal Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.coverLetter}
                  className="text-black border-gray-300"
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  rows={8}
                  required
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
              <Link to="/jobs">
                <Button type="button" variant="outline" className="flex-1 text-black">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}