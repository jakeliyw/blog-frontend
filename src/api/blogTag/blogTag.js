import { get } from '../../utils/request'
import API_PREFIX from '../../utils/apiPrefix'

export const tagList = params => get(`${API_PREFIX}/tag/list`, params)


