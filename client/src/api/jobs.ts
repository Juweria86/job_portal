import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/jobs"; // or your deployed backend URL

// Get all jobs
export const getAllJobs = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

export const getJobById = async (id: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${id}`)
    return res.data
  } catch (error) {
    console.error("Error fetching job:", error)
    throw error // Re-throw to handle in component
  }
}

// Create a new job
export const createJob = async (data: {
  title: string;
  description: string;
  deadline: string;
}) => {
  const res = await axios.post(API_BASE_URL, data, {

  });
  return res.data;
};

// Update a job
export const updateJob = async (id: string, data: any) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, data, {

  });
  return res.data;
};

// Delete a job
export const deleteJob = async (id: string) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`, {
  });
  return res.data;
};
