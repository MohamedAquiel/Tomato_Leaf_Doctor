import axios from './axios'

export const getProfile = async () => {
  const response = await axios.get('/users/profile')
  return response.data
}

export const updateProfile = async (data) => {
  const response = await axios.put('/users/profile', data)
  return response.data
}

export const getDashboardStats = async () => {
  const response = await axios.get('/users/stats')
  return response.data
}

export const getAllUsers = async (params) => {
  const response = await axios.get('/users', { params })
  return response.data
}

export const deleteUser = async (id) => {
  const response = await axios.delete(`/users/${id}`)
  return response.data
}

export const updateUser = async (id, data) => {
  const response = await axios.put(`/users/${id}`, data)
  return response.data
}
