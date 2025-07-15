import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api/applicants" // Adjust based on your backend

// Submit a new job application
export const submitApplication = async (applicationData: any) => {
  const response = await axios.post(API_BASE_URL, applicationData)
  return response.data
}

// Get all applicants for a specific job
export const getApplicantsByJob = async (jobId: string) => {
  const response = await axios.get(`${API_BASE_URL}/job/${jobId}`)
  return response.data
}

// Get a specific applicant by ID
export const getApplicant = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`)
  return response.data
}
