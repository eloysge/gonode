'use strict'

const Env = use('Env')
const Route = use('Route')

Route.group(() => {
  Route.post('users', 'UserController.store').validator('User')
  Route.post('sessions', 'SessionController.store').validator('Session')
  Route.post('passwords', 'ForgotPasswordController.store').validator('ForgotPassword')
  Route.put('passwords', 'ForgotPasswordController.update').validator('ResetPassword')
}).prefix(Env.get('APP_PREFIX'))

Route.group(() => {
  Route.get('files/:id', 'FileController.show')
  Route.post('files', 'FileController.store')
  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .validator(new Map(
      [
        [
          ['projects.store'],
          ['Project']
        ]
      ]
    ))
  Route.resource('projects.tasks', 'TaskController')
    .apiOnly()
    .validator(new Map(
      [
        [
          ['projects.tasks.store'],
          ['TaskStore']
        ],
        [
          ['projects.tasks.update'],
          ['TaskUpdate']
        ]
      ]
    ))
}).middleware(['auth']).prefix(Env.get('APP_PREFIX'))
