import { changePageTitle } from '@/common/helpers/document'
import { useAuth } from '@/domain/auth/contexts'

export function Home(): JSX.Element {
  changePageTitle('Página inicial') // TODO: i18n

  const { session } = useAuth()

  return (
    <div>
      <p>Página inicial</p>
      <p>Olá {session?.user.name}!</p>
    </div>
  )
}
