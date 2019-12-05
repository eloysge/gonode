'use strict'

const Task = use('App/Models/Task')

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ params }) {
    const tasks = await Task
      .query()
      .where('project_id', params.projects_id)
      .with('project')
      .with('user')
      .fetch()
    return tasks
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ params, request }) {
    const data = request.only([
      'user_id',
      'title',
      'description',
      'due_date',
      'file_id'
    ])
    const task = await Task.create({ ...data, project_id: params.projects_id })
    return task
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const task = await Task.findOrFail(params.id)
    await task.load('project')
    await task.load('user')
    await task.load('file')
    return task
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const task = await Task.findOrFail(params.id)
      const data = request.only([
        'user_id',
        'title',
        'description',
        'due_date',
        'file_id'
      ])
      task.merge(data)
      await task.save()
      return task
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: err.message } })
    }
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id)
      await task.delete()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: err.message } })
    }
  }
}

module.exports = TaskController
