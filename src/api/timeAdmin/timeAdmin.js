import { get, post } from '../../utils/request'

export const timeAdmin = params => get('/api/blog/timeAdmin', params)
export const timeDetail = params => get('api/blog/timeDetail', params)
export const timeDel = data => post('api/blog/timeDel', data)
export const timeNew = data => post('/api/blog/timeNew', data)
export const timeUpdate = data => post('/api/blog/timeUpdate', data)
