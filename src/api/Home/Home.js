import { get } from '../../utils/request'

export const routerMenu = params => get('/api/menu', params)
export const routerAdmins = params => get('/api/getAdmins', params)
export const routerTime = params => get('/api/getTime', params)
export const routerTag = params => get('/api/getTag', params)


