'use strict'

class ResetPassword {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      token: 'required',
      password: 'required|min:6|confirmed'
    }
  }
}

module.exports = ResetPassword
