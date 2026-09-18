import api from './axios.js';

/**
 * Fetch all resources for the authenticated user.
 * @returns {Promise<Array>} Array of resource objects
 */
export const fetchResources = async () => {
  const { data } = await api.get('/api/resources');
  return data.data;
};

/**
 * Create a new resource.
 * @param {{ title: string, type: 'link'|'pdf', url: string, tags: string[] }} payload
 * @returns {Promise<Object>} Created resource object
 */
export const createResource = async (payload) => {
  const { data } = await api.post('/api/resources', payload);
  return data.data;
};

/**
 * Delete a resource by ID.
 * @param {string} id Resource MongoDB _id
 */
export const deleteResource = async (id) => {
  await api.delete(`/api/resources/${id}`);
};
