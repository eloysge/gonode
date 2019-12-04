'use strict'

const Env = use('Env')
const crypto = use('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')
const { differenceInMinutes } = use('date-fns')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      try {
        await Mail.send(
          ['emails.forgot_password'],
          {
            email,
            token: user.token,
            link: `${request.input('redirect_url')}?token=${user.token}`
          },
          message => {
            message
              .to(user.email)
              .from('email@sgeinformatica.com.br', 'Sge Informática')
              .subject('Recuperação de senha')
          }
        )
      } catch (errmail) {
        return response
          .status(errmail.status)
          .send(errmail.message)
      }
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Verifique se o email é válido.' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()
      const user = await User.findByOrFail('token', token)
      const tokenTime = differenceInMinutes(new Date(), user.token_created_at)

      // Tempo de vida do token
      if (tokenTime >= Env.get('TOKEN_FORGOT_PASSWORD_LIFETIME', 60)) {
        return response
          .status(401)
          .send({ error: { message: 'O token de recuperação está expirado' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password
      user.save()

      return response
        .status(200)
        .send({ ok: 'Senha alterada com sucesso' })
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Não foi possivel fazer o RESET da senha' } })
    }
  }
}

module.exports = ForgotPasswordController
