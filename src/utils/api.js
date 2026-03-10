import axios from 'axios'

const api = axios.create({
    baseURL: 'https://tt-jsonserver-01.alt-tools.tech',
    timeout: 10000,
})

// TOOLS
export const getRecentTools = () =>
    api.get('/tools?_sort=updated_at&_order=desc&_limit=8').then(r => r.data)

export const getAllTools = () =>
    api.get('/tools?_sort=monthly_cost&_order=desc').then(r => r.data)

export const getToolsByStatus = (status) =>
    api.get(`/tools?status=${status}`).then(r => r.data)

// ANALYTICS
export const getAnalytics = () =>
    api.get('/analytics').then(r => r.data)

// DEPARTMENTS
export const getDepartments = () =>
    api.get('/departments').then(r => r.data)

// USERS
export const getUsers = () =>
    api.get('/users').then(r => r.data)

export default api