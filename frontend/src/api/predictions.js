import axios from './axios'

export const createPrediction = async (formData) => {
  const response = await axios.post('/predictions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const getMyPredictions = async (params) => {
  const response = await axios.get('/predictions/my', { params })
  return response.data
}

export const getPrediction = async (id) => {
  const response = await axios.get(`/predictions/${id}`)
  return response.data
}

export const deletePrediction = async (id) => {
  const response = await axios.delete(`/predictions/${id}`)
  return response.data
}

export const updateNotes = async (id, notes) => {
  const response = await axios.put(`/predictions/${id}/notes`, { notes })
  return response.data
}

export const getAllPredictions = async (params) => {
  const response = await axios.get('/predictions', { params })
  return response.data
}
