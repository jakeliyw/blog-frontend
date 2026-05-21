import { get } from '../../utils/request'
import API_PREFIX from '../../utils/apiPrefix'
export const getBlogDetail = id => get(`${API_PREFIX}/article/${id}`)
export const getBlogArticle = params => get('/api/blog/list', params)
