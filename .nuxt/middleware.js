const middleware = {}

middleware['theme'] = require('..\\src\\middleware\\theme.js')
middleware['theme'] = middleware['theme'].default || middleware['theme']

export default middleware
