'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')
const User = use('App/Models/User')

const TaskHook = exports = module.exports = {}

TaskHook.sendNewTaskMail = async (taskInstance) => {
  if (!taskInstance.user_id || !taskInstance.dirty.user_id) return

  const user = await User.findOrFail(taskInstance.user_id)
  if (!user) return

  const { email, username } = await taskInstance.user().fetch()
  const file = await taskInstance.file().fetch()
  const { title } = await taskInstance

  await Mail.send(
    ['emails.new_task'],
    { username, title, hasAttachment: !!file },
    message => {
      message
        .to(email)
        .from('email@sgeinformatica.com.br', 'Sge informática')
        .subject('Nova tarefa para você')
      if (file) {
        message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
          filename: file.name
        })
      }
    }
  )
}
