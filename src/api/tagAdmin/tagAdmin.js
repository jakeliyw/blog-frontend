import { get, post } from '../../utils/request'

export const tagList = params => get('/api/blog/tagList?isadmin=1', params)
export const tagDetail = params => get('/api/blog/tagDetail', params)
export const tagNew = data => post('/api/blog/tagNew', data)
export const tagUpdate = data => post('/api/blog/tagUpdate', data)
export const tagDel = data => post('/api/blog/tagDel', data)
