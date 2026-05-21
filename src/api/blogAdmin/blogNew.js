import { get, post } from '../../utils/request'

export const blogTag = params => get('/api/blog/tagList', params)
export const postNewBlog = data => post('/api/blog/new', data)
