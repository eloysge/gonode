'use strict'

const Model = use('Model')
const Env = use('Env')

class File extends Model {
  static get computed () {
    return ['url', 'Token']
  }

  getUrl ({ id }) {
    return `${Env.get('APP_URL')}/files/${id}`
  }

  getToken ({ id, name }) {
    return `${id}/token/${name}`
  }
}

module.exports = File
