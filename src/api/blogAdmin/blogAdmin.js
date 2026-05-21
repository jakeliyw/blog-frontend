import { get, post } from '../../utils/request'

export const getAdmin = params => get('/api/blog/list?isadmin=1', params)
export const delAdmin = data => post('/api/blog/del', data)
