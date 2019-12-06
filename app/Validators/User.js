'use strict'

class User {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required|min:6|confirmed'
    }
  }
}

module.exports = User
