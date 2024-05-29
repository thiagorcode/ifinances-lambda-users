# ifinances-lambda-users

## Default Architecture

url: https://aws.amazon.com/pt/blogs/compute/developing-evolutionary-architecture-with-aws-lambda/
```
my-app/
│
├── src/
│ ├── tests/ # Testes unitários
│ ├── core/
│ │ ├── core.ts # Lógica de negócios (núcleo da aplicação)
│ │
│ ├── repository/
│ │ ├── data-repository.ts # Porta de saída (interface)
│ │ ├── dynamodb-adapter.ts # Adaptador de saída para DynamoDB
│ │
│ ├── lambdas/
│ ├── store-data/
│ │ │ ├── lambda-store-data.ts # Função Lambda para armazenar dados
│ │ │
│ ├── get-data/
│ │ │ ├── lambda-get-data.ts # Função Lambda para obter dados
│
├── package.json # Arquivo de configuração do projeto
```