export const commonPt = {
  loading: 'Carregando',

  exceptions: {
    applicationException: 'Ocorreu um erro inesperado',
    forbiddenException: 'Sem permissão para realizar essa ação',
    notFound: 'Registro não encontrado',
    unauthorizedException: 'Credenciais inválidas ou sessão expirada',
    unprocessableEntityException: 'Ocorreu uma falha na regra de negócio',
    validationException: 'Ocorreu um erro de validação',
  },

  validators: {
    required: 'Este campo é obrigatório',
    min: (value: number): string => `Este campo deve conter no mínimo ${value} caracteres`,
    max: (value: number): string => `Este campo deve conter no máximo ${value} caracteres`,
    withoutSpace: 'Este campo não deve conter espaços',
    lowercase: 'Este campo deve conter no mínimo uma letra minúscula',
    uppercase: 'Este campo deve conter no mínimo uma letra maiúscula',
    number: 'Este campo deve conter no mínimo um número',
    specialCharacter: 'Este campo deve conter no mínimo um caractere especial',
  },
}
