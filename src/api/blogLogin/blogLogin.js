import { post } from '../../utils/request'

export const postLogin = data => post('/api/user/login', data)
