'use strict'

const User = use('App/Models/User')
const Kue = use('Kue')
const Job = use('App/Jobs/NewTaskMail')

const TaskHook = exports = module.exports = {}

TaskHook.sendNewTaskMail = async (taskInstance) => {
  if (!taskInstance.user_id || !taskInstance.dirty.user_id) return

  const user = await User.findOrFail(taskInstance.user_id)
  if (!user) return

  const { email, username } = await taskInstance.user().fetch()
  const file = await taskInstance.file().fetch()
  const { title } = await taskInstance

  Kue.dispatch(Job.key, { email, username, title, file }, { attempts: 3 })
}
