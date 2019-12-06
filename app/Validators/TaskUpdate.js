'use strict'

class TaskUpdate {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      due_date: 'date'
    }
  }
}

module.exports = TaskUpdate
