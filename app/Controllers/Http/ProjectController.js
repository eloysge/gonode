'use strict'

const Project = use('App/Models/Project')

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  async index ({ request }) {
    const { page } = request.get()
    const project = await Project.query()
      .with('user')
      .with('tasks')
      .paginate(page)
    return project
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'description'])
    const project = await Project.create({ ...data, user_id: auth.user.id })
    return project
  }

  async show ({ params, response }) {
    const project = await Project.findOrFail(params.id)
    await project.load('user')
    await project.load('tasks')
    return project
  }

  /**
   * Update project details.
   * PUT or PATCH projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const project = await Project.findOrFail(params.id)
      const data = request.only(['title', 'description'])
      project.merge(data)
      await project.save()
      return project
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: err.message } })
    }
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    try {
      const project = await Project.findOrFail(params.id)
      await project.delete()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: err.message } })
    }
  }
}

module.exports = ProjectController
