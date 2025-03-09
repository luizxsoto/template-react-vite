# Template React Vite 🧰

Esse projeto tem como objetivo servir como base para novos projetos front-end que venham surgir.

## Pré-requisitos

Para começar a utilizar esse projeto, antes é necessário atender os seguintes pré-requisitos:

- node.js - Indicado a utilização do [NVM](https://github.com/nvm-sh/nvm) com node LTS;
- editor de texto - Indicado a utilização do [VSCode](https://code.visualstudio.com);
- git - Para versionamento do código [GIT](https://git-scm.com);

## Dependências

Dentre as diversas dependências que esse projeto possui, as mais importantes são:

- [react](https://react.dev) - Para biblioteca de interface;
- [typescript](https://www.typescriptlang.org/) - Para melhorar a cooperatividade no projeto;
- [vite](https://vitejs.dev/) - Para realizar o bundle da aplicação;
- [material-ui](https://mui.com/) - Para componentização padronizada;
- [react-hook-forms](https://react-hook-form.com) - Para lidar com formulários;
- [react-query](https://tanstack.com/query/latest) - Para lidar com cache;
- [react-idle-timer](https://idletimer.dev) - Para verificar se o usuário está ocioso;
- [yup](https://github.com/jquense/yup) - Para validação dos formulários;
- [commitlint](https://commitlint.js.org) / [husky](https://typicode.github.io/husky/) - Para adotar um padrão de commits e nome de branches;
- [playwright](https://playwright.dev) / [lighthouse](https://www.npmjs.com/package/lighthouse) - Para rodar os testes E2E e garantir a mínima performance;
- [eslint](https://eslint.org) / [prettier](https://prettier.io) - Para adotar um padrão de código;
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) - Para verificar se existem pacotes desatualizados;

## Mock Server

Algumas vezes, acontece do desenvolvimento front estar mais adiantado se comparado ao desenvolvimento do back. Portanto, optamos em utilizar esse mock server com o objetivo de mocar as apis que o front chama, sendo necessário apenas definir os contratos.

O mock server é basicamente um servidor node vanilla composto por rotas e seeds. As rotas são os endpoints que o front chama do back e as seeds são os registros que essas rotas retornam, normalmente são os "models" que a aplicação possui, mas algumas das vezes, os models não são iguais aos retornos dos endpoints. Então pra não precisar ficar tratando na rota questão de eager/lazy loadings (joins que o back faz), optamos em já criar as seeds de acordo com o retorno dos endpoints. Com isso, acontecerá de ter seeds do model "User" e seeds também do model "UserDetails", por exemplo.

Como é utilizado o "tsx" pro mock server, caso for importar alguma tipagem ou até mesmo um helper de fora da pasta "mock-server", é indicado importar o arquivo diretamente em vez do index, exemplo:

- ✅: `import ... from '@/common/constants/date'`;
- ❌: `import ... from '@/common/constants'`;

Isso é feito pra evitar que o mock server faça o "watch" de arquivos que são de produção e não interferem no mock server em si.

## Typescript

A fim de gerar uma melhor integração entre os desenvolvedores, facilitar manutenção e outros diversos fatores nos levou a adotar o Typescript em vez de só Javascript. Com isso, conseguimos seguir uma estrutura bem solida de contratos entre as camadas da aplicação. Portanto é extremamente importante estar criando a tipagem / contrato pra cada camada da aplicação, mesmo que seja repetida, como acontece com frequência no `service` e `api`. Porém, como em alguns casos pode mudar um campo que for, a fim de padronizar criamos a tipagem / contrato pra cada camada. Para não ficar repetindo dos as propriedades de cada tipagem / contrato, basta realizar o `extends` nas interfaces.

Para as interfaces, delimitamos o seguinte padrão de escrita de seus nomes:

`{Ação}{Entidade}{Tipo}{Params/Props/Result}`.

Exemplos:

- CreateUserServiceParams;
- UpdateUserApiResult;
- ShowUserHookParams;

Mesmo assim, em alguns momentos pode ser criado interfaces com nomes mais enxutos, como por exemplo: UserDataForm. Mesmo assim, sempre que possível, seguir o padrão adotado acima.

## Cache

Para melhorar a experiencia do usuário, optamos em implementar um sistema de cache no próprio front, de modo que evite algumas chamadas ao back consequentemente evitando alguns loadings desnecessários. Pra isso, utilizamos o react query, com ele conseguimos tanto salvar o cache automaticamente nos GETs ao back e também quando é feito algum POST/PUT/PATCH/DELETE, assim manipulando o cache manualmente para que os GETs fiquei cientes da criação, alteração o remoção de algum registro. Esses procedimentos são realizados especialmente nos arquivos de "hooks" e em alguns arquivos de "contexts".

## LocalStorage

Para armazenar algumas informações do usuário, optamos em salva-las no localStorage, optando em salvar o menos possível. Caso ainda sim precise salvar mais informações, o ideal é criar uma api de `GET:/me` para carregar as informações do usuário logado. Para distinguir o localStorage da aplicação dos demais, é importante alterar a chave do localStorage, buscando por:

- `CTRL + SHIFT + F`: `StorageKey = '@template-react-vite`;

Assim alterando o `template-react-vite` para o respectivo nome da sua aplicação.

## Testes

A fim de manter a qualidade da aplicação, teste são indispensáveis! Portanto, optamos em fazer apenas os testes de ponta a ponta (E2E) utilizando o mock-server para rodar tanto localmente quanto nos pipelines quando criado um MR. Com isso, tudo sobre testes deve se localizar dentro da pasta `tests`. E o ideal é que os testes não necessariamente dependam de arquivos de produção (src), desse modo evitando o acoplamento entre arquivos de teste com arquivos de produção.

## Camadas

Com o objetivo de distinguir as responsabilidades da aplicação, possuímos as seguintes camadas:

- Pages: Onde fica localizado toda a componentização e comportamento das telas;
- Hooks/Contexts: Camada entre tela e serviços, a qual pode tratar dados se necessário e emitir alguns alertas;
- Services: Responsável por tratar os dados das requisições e respostas de apis;

Então, o ideal é que respeite esse passo a passo de modo que as `Pages` chamem os `Hooks/Contexts` e que chamem respectivamente seus `Services`.

## Variáveis de ambiente

Para que seja possível rodar em qualquer ambiente que for, é possível criar as variáveis de ambientes para cada respectivo ambiente:

- `.env.local`;
- `.env.dev`;
- `.env.qa`;
- `.env.prd`;

## GitFlow / TrunkBased

Vale ressaltar que seguimos o padrão "TrunkBased", ou seja, não temos uma branch para cada ambiente (dev, qa, prd). Temos apenas a branch main a qual as branches release e hotfix partem. A partir das branches release, são criadas as branches feature, bugfix e etc. Além disso é importante seguir o padrão adotado de nomenclatura e ajustar o arquivo `.husky/prepare-commit-msg`, alterando a palavra "TEMPLATE" para a palavra utilizada nos ids das tasks.

## Como utilizar

Antes de começar a utiliza a aplicação, o ideal é fazer um `find/replace` no projeto, buscando por `template-react-vite`|`templateReactVite`|`TemplateReactVite`|`TEMPLATE_REACT_VITE`|`Template React Vite` e alterando pelo nome da sua aplicação de fato, respectivamente.

```bash
# instalar as dependências
# é necessário o arquivo .npmrc para instalar o Design System
npm install

# rodar a aplicação local com mock-server
npm run local:mock

# rodar a aplicação apontando pra dev
npm run dev

# rodar a aplicação apontando pra qa
npm run qa

# rodar a aplicação apontando pra prd
npm run prd

# rodar os testes sem UI
npm run test:e2e:run

# rodar os testes com UI
npm run test:e2e:open
```
