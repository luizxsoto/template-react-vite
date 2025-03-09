const stringValidators = {
  required: 'Este campo é obrigatório',
  url: 'Este campo deve ser uma URL válida',
  email: 'Este campo deve ser um e-mail válido',
  phone: 'Este campo deve ser um numero válido',
  name: 'Este campo deve ser maior ou igual a seis caracteres',
  document: 'Este campo deve ser um CPF ou CNPJ válido',
  code: 'Este campo deve possuir um código válido',
  checked: 'Este campo deve estar marcado',
  withoutSpace: 'Este campo não deve conter espaços',
  lowercase: 'Este campo deve conter no mínimo uma letra minúscula',
  number: 'Este campo deve conter no mínimo um número',
  uppercase: 'Este campo deve conter no mínimo uma letra maiúscula',
  specialCharacter: 'Este campo deve conter no mínimo um caractere especial',
  sameOf: 'Esta senha deve ser a mesma digitada no campo anterior',
  lessThanNinety: 'Este campo deve conter uma data anterior à 90 dias atrás',
  moreThanOtherInput: 'Este campo deve conter uma data superior ao outro campo',
  documentAlreadyExists: 'CPF/CNPJ já está em uso',
}

const functionValidators = {
  oneOf: (values: Array<number | string>): string =>
    `Selecione algum dos valores: ${values.join(', ')}`,
  max: (value: number): string => `Este campo deve conter no máximo ${value} de tamanho`,
  min: (value: number): string => `Este campo deve conter no mínimo ${value} de tamanho`,
  selectMaxSize: (size: number): string =>
    `O número máximo de registros selecionados deve ser igual ou inferior a ${size}`,
}

export const commonPt = {
  components: {
    drawer: {
      title: 'Template React Vite',
      menu: 'Menu',
      facebook: 'Facebook',
      instagram: 'Instagram',
      userImage: 'Imagem do usuário',
    },
    table: {
      body: {
        attention: 'Atenção!',
        confirm: 'Sim',
        cancel: 'Não',
      },
      head: {
        actions: 'Ações',
      },
      header: {
        selectAField: 'Selecione um campo',
        atField: 'Campo',
        searchFor: 'Pesquisar',
        from: 'De',
        to: 'Até',
      },
      pagination: {
        from: 'de',
        rowsPerPage: 'Linhas por página',
      },
    },
  },
  exceptions: {
    applicationException: 'Ocorreu um erro inesperado',
    forbiddenException: (resource: string): string =>
      `Sem permissão para acessar o recurso: ${resource}`,
    notFound: 'Registro não encontrado',
    unauthorizedException: 'Credenciais inválidas ou sessão expirada',
    validationException: 'Ocorreu um erro de validação',
  },
  helpers: {
    file: {
      failToRead: 'Ocorreu um erro ao tentar ler os arquivos',
      failToDownload: 'Ocorreu um erro ao tentar baixar os arquivos',
    },
  },
  pages: {
    dashboard: {
      message: 'Página inicial sem conteúdo',
    },
    forbidden: {
      title: 'Acesso Negado',
      subTitle: 'Você não possui permissão para acessar esta página',
    },
    notFound: {
      title: 'Página não encontrada',
      subTitle: 'Não foi possível encontrar a página requisitada',
    },
  },
  services: {
    api: {
      refreshTokenError: 'Não foi possível identificar o "refreshToken" localmente',
      makeRefreshToken: 'Atualizar token da sessão',
    },
  },
  stringValidators,
  functionValidators,
  validators: { ...stringValidators, ...functionValidators }, // DOCS: Necessary separation to handle API response validation errors
}
