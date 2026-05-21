import { get } from '../../utils/request'
import API_PREFIX from '../../utils/apiPrefix'

export const getBlogArticle = params => get(`${API_PREFIX}/article/list`, params)
