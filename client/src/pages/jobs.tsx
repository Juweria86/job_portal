import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Link } from "react-router-dom"
import { Calendar, MapPin, Building } from "lucide-react"
import { getAllJobs } from "../api/jobs" // adjust the path based on your folder structure

interface Job {
  id: string
  title: string
  description: string
  deadline: string
  createdAt: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const allJobs = await getAllJobs()
        const activeJobs = allJobs.filter((job: Job) => new Date(job.deadline) > new Date())
        setJobs(activeJobs)
      } catch (err) {
        console.error(err)
        setError("Failed to fetch job listings.")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Available Positions</h1>
            <p className="text-black max-w-2xl mx-auto">
              Discover exciting career opportunities and take the next step in your professional journey
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-black">Loading jobs...</p>
        ) : error ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Link to="/">
                <Button className="mt-4">Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        ) : jobs.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <div className="mb-4">
                <Building className="w-16 h-16 text-black mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">No Active Job Postings</h3>
              <p className="text-black mb-6">
                There are currently no active job postings. Please check back later for new opportunities.
              </p>
              <Link to="/">
                <Button>Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-black">{job.title}</CardTitle>
                      <CardDescription className="text-base text-black">
                        {job.description.length > 200 ? `${job.description.substring(0, 200)}...` : job.description}
                      </CardDescription>
                    </div>
                    <Badge className="ml-4">Open</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 text-sm text-black">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Remote/On-site</span>
                      </div>
                    </div>
                    <Link to={`/apply/${job._id}`}>
                      <Button>Apply Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
