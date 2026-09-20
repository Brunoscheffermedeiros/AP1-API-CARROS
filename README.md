# API Carros

API REST minimalista para gerenciamento de carros, desenvolvida com ASP.NET Core e .NET 10.

## Tema e objetivo

O tema da API é o gerenciamento de carros.

O objetivo é disponibilizar uma API REST para cadastrar, consultar, atualizar e remover carros.

## Requisitos

- .NET SDK 10.0 ou superior

## Como executar

Na raiz do projeto, execute:

```bash
dotnet run
```

A API estará disponível em:

- HTTP: `http://localhost:5050`

Para verificar se a API está funcionando:

```http
GET http://localhost:5050/
```

Resposta esperada:

```text
API dos carros está no ar!
```

## Endpoints

|Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/api/carros`| Lista todos os carros |
| GET | `/api/carros/{id}` | Busca um carro pelo ID |
| POST | `/api/carros` | Cadastra um novo carro |
| PUT | `/api/carros/{id}` | Atualiza um carro existente |
| DELETE | `/api/carros/{id}` | Remove um carro |

### Listar carros

```http
GET /api/carros
```

### Buscar carro por ID

```http
GET /api/carros/1
```

### Cadastrar carro

```http
POST /api/carros
Content-Type: application/json

{
    "modelo": "Fusca",
    "ano": 1985,
    "cor": "Branco"
}
```

### Atualizar carro

```http
PUT /api/carros/1
Content-Type: application/json

{
    "modelo": "Fusca",
    "ano": 1980,
    "cor": "Preto"
}
```

## Observações

- A aplicacao inicia com os carros `Fox` e `Gol`.
- Os dados ficam armazenados somente em memoria e sao perdidos ao reiniciar a aplicacao.
- Operacoes para ID inexistente retornam HTTP `404 Not found`.
- O cadastro retorna HTTP `201 Created` e a remocao bem-sucedida retorna HTTP `204 No Content`.

## Collection do Bruno

A collection utilizada para testar a API está localizada na pasta: `bruno`

## Link para vídeo de demonstração:

