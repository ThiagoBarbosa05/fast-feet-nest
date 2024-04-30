
# Fast Feet API

Aplicação de delivery desenvolvida como solução ao desafio proposto no ignite Node.js da Rocketseat.



## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/ThiagoBarbosa05/fast-feet-nest.git
```

Entre no diretório do projeto

```bash
  cd fast-feet-nest
```

Instale as dependências

*Nessa aplicação foi utilizado o pnpm como gerenciador de pacotes, mas você poderá utilizar um de sua preferência.*

```bash
  npm install
```

Inicie o banco de dados

```bash
  docker compose up -d
```

- **Se não posuir o [Docker](https://docs.docker.com/engine/install/), pode usar um cliente Postgresql e Redis.**

Inicie o servidor

```bash
  npm run start:dev
```


## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`DATABASE_URL`

`JWT_PRIVATE_KEY`

`JWT_PUBLIC_KEY`

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

`AWS_BUCKET_NAME`

`CLOUDFARE_ACCOUNT_ID`


## Rodando os testes

Para rodar os testes, rode o seguinte comando

- Para rodar testes unitários

```bash
  npm run test
```

- Para rodar testes ponta a ponta (E2E)

```bash
  npm run test:e2e
```


## Documentação

- Rodando aplicação localmente.
[http://localhost:3000/api](http://localhost:3000/api)


## Stack utilizada

- [Nest.js](https://docs.nestjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Postgresql](https://www.postgresql.org/docs/)
- [Prisma](https://www.prisma.io/docs)
- [Redis](https://redis.io/docs/latest/)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/guide/)




## Aprendizados

O que você aprendeu construindo esse projeto? Quais desafios você enfrentou e como você superou-os?

- DDD (Domain Driven Design)
- Clean architecture
- Criar camadas da aplicação totalmente desacopladas usando o framework Nest.js
- Armazenamento de objetos utilizando cloudfare R2
- Armazenamento em cache utilizando Redis
- Disparar eventos de domínio para o usuário quando determinada ação ocorre (ex: Notificações)
## Autores

- [@ThiagoBarbosa](https://github.com/ThiagoBarbosa05)

