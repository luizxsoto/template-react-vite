export const userPt = {
  role: {
    admin: 'Administrador',
    manager: 'Gerente',
    normal: 'Normal',
  },
  status: {
    active: 'Ativo',
    inactive: 'Inativo',
  },
  resources: {
    create: 'Criar usuário',
    list: 'Listar usuários',
    show: 'Visualizar usuário',
    update: 'Atualizar usuário',
    remove: 'Remover usuário',
    updateProfile: 'Atualizar perfil',
    sendUserCredentials: 'Enviar credenciais do usuário',
  },
  pages: {
    form: {
      pageTitle: 'Gestão de Usuário',
      userImage: 'Imagem do usuário',
      toast: {
        created: 'Usuário criado com sucesso',
        updated: 'Usuário atualizado com sucesso',
      },
      content: {
        inputs: {
          name: 'Nome',
          email: 'E-mail',
          document: 'CPF / CNPJ',
          password: 'Senha',
          confirmPassword: 'Confirme a senha',
          phone: 'Telefone / Celular',
          status: 'Status',
          role: 'Papel',
          image: 'Imagem',
        },
        helperTexts: {
          name: 'Digite seu nome.',
          role: "O papel 'Gerente' pode realizar alterações de alto nível",
        },
        buttons: {
          confirm: 'Salvar',
          confirmDialog: 'Confirmar',
          cancel: 'Cancelar',
        },
        tooltips: {
          sendCredentials: 'Enviar credenciais do usuário por e-mail',
        },
      },
    },
    list: {
      pageTitle: 'Gestão de Usuários',
      search: 'Pesquisar',
      toast: {
        removed: 'Usuário removido',
        credentialsSent: 'Credenciais do usuário enviadas com sucesso',
      },
      tableColumn: {
        name: 'Nome',
        email: 'E-mail',
        document: 'CPF / CNPJ',
        role: 'Papel',
        status: 'Status',
      },
      action: {
        show: 'Detalhes',
        update: 'Atualizar',
        remove: 'Remover',
        email: 'Enviar credenciais',
        confirmRemove: 'Deseja mesmo remover este registro?',
      },
      helperTexts: {
        sendCredentials:
          'Ao enviar as credenciais do usuário por e-mail, a senha do mesmo será redefinida. Deseja continuar?',
      },
    },
    profile: {
      pageTitle: 'Perfil',
      userImage: 'Imagem do usuário',
      toast: {
        updated: 'Perfil atualizado com sucesso',
      },
      inputs: {
        name: 'Nome',
        email: 'E-mail',
        document: 'CPF / CNPJ',
        changePassword: 'Alterar senha',
        password: 'Senha',
        confirmPassword: 'Confirme a senha',
        phone: 'Telefone / Celular',
        image: 'Selecione uma imagem',
      },
      helperTexts: {
        name: 'Digite seu nome',
      },
      errors: {
        imageSize: 'Tamanho da imagem deve ser igual o inferior a 4MB',
        imageType: 'Tipo da imagem deve ser ".png" ou ".jpg"',
      },
      buttons: {
        confirm: 'Salvar',
        cancel: 'Cancelar',
      },
    },
  },
}
