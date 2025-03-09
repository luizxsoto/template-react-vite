export const authPt = {
  resources: {
    createSession: 'Criar sessão',
    showSession: 'Carregar sessão',
    forgotPassword: 'Recuperar senha',
    resetPassword: 'Alterar senha',
  },
  pages: {
    login: {
      pageTitle: 'Entrar',
      title: 'Entrar',
      companyLogo: 'Logo da empresa',
      inputs: {
        document: 'Informe seu CPF ou CNPJ',
        password: 'Informe sua senha',
      },
      buttons: {
        confirm: 'Entrar',
        forgotPassword: 'Esqueceu sua senha?',
      },
      toast: {
        wrongDocumentOrPassword: 'CPF/CNPJ ou senha inválida',
      },
    },
    forgotPassword: {
      pageTitle: 'Recuperar senha',
      title: 'Esqueceu sua senha?',
      inputs: {
        document: 'Informe seu CPF ou CNPJ',
      },
      buttons: {
        confirm: 'Enviar por e-mail',
        alreadyHasPassword: 'Já possuo a senha',
      },
      toast: {
        emailSent: 'E-mail enviado, verifique a caixa de entrada',
        codeLimitReached: 'Limite de 3 e-mails diários atingido',
      },
    },
    resetPassword: {
      pageTitle: 'Nova senha',
      title: 'Definir nova senha',
      inputs: {
        document: 'CPF ou CNPJ',
        code: 'Código',
        password: 'Nova senha',
        confirmPassword: 'Confirme a nova senha',
      },
      buttons: {
        confirm: 'Confirmar alteração de senha',
        backToLogin: 'Voltar para o login',
      },
      toast: {
        updatedPassword: 'Senha alterada com sucesso',
        invalidCode: 'Código inválido, verifique se está digitado corretamente',
      },
    },
  },
}
