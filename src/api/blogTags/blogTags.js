import { get } from '../../utils/request'

export const getBlogArticle = params => get('/api/blog/list', params)
