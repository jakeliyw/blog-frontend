import { get, post } from '../../utils/request'

export const getDetail = params => get('/api/blog/detail', params)
export const postNewBlog = data => post('/api/blog/update', data)
