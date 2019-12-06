'use strict'

class TaskStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      due_date: 'date'
    }
  }
}

module.exports = TaskStore
