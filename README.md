# API Carros (AS — Avaliação Semestral)

Projeto de API REST desenvolvida com ASP.NET Core (.NET 10), integrada a uma interface Web (`wwwroot`) e banco de dados SQLite com Entity Framework Core. Nesta etapa, o código foi refatorado para separar responsabilidades em pastas e namespaces específicos, além de contar com um middleware para tratamento de exceções.

## Tema e Objetivo
O tema da aplicação é o gerenciamento de veículos (Carros). O objetivo é disponibilizar uma API REST organizada e persistente para cadastrar, consultar, atualizar e excluir registros, mantendo o contrato da API e a compatibilidade com o frontend.

---

## Requisitos
- **.NET SDK 10.0** ou superior
- **VS Code** com a extensão **Live Server** (para executar a interface Web em `wwwroot`)
- **Bruno** (para execução dos testes sequenciais da Collection)

---

## Organização do Projeto

A estrutura de pastas foi dividida por responsabilidade para facilitar a manutenção:

```
ApiCarros/
Data/
    ApiDbContext.cs
Dtos/
    CarroDto.cs
    CarroEntradaDto.cs
Models/
    CarrosEntity.cs
Migrations/
wwwroot/
bruno/
Program.cs
```

---

## Preparação e Execução

1. **Abra o terminal na pasta raiz do projeto (`ApiCarros/`)**.

2. **Execute a aplicação:**
   ```bash
   dotnet run
   ```
   > **Preparação do Banco:** Ao iniciar, a aplicação aplica automaticamente as migrations pendentes via `dbContext.Database.Migrate()`, criando/atualizando o banco SQLite local (`api-carros.db`) sem necessidade de comandos manuais adicionais.
3. **Confira o endereço exibido no terminal** (ex: `http://localhost:5050`).

4. **1 - Executar pela Interface Web (Frontend):**
   - Abra o arquivo `wwwroot/index.html` no VS Code e clique em **Go Live** (extensão Live Server).

5. **2 - Executar pela Collection no Bruno:**
   - Abra o aplicativo **Bruno** e clique em **Open Collection**
   
   - Selecione a pasta `bruno/` localizada na raiz deste repositório
   
   - No canto superior direito do Bruno, selecione o ambiente local e confirme se a `baseUrl` corresponde à porta exibida no terminal pelo `dotnet run` (ex: `http://localhost:5050`)
   
   - Execute as requisições na ordem numerada para validar o ciclo completo (listagem → criação → consulta por ID → atualização → conferência → exclusão → validação de `404 Not Found` e persistência após reinício).

---

## Contrato da API e Status HTTP

| Método | Rota | Descrição | Status Esperado |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/carros` | Lista todos os carros cadastrados | `200 OK` |
| **GET** | `/api/carros/{id}` | Busca um carro específico pelo ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/carros` | Cadastra um novo carro | `201 Created` |
| **PUT** | `/api/carros/{id}` | Atualiza os dados de um carro existente | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/carros/{id}` | Remove um carro pelo ID | `204 No Content` / `404 Not Found` |

### Exemplo de Corpo JSON (`POST` e `PUT`)
```json
{
  "modelo": "Civic",
  "ano": 2022,
  "cor": "Preto"
}
```

---

## Vídeo de Demonstração

[Clique aqui para assistir ao vídeo](https://drive.google.com/file/d/1QDtGkGVgqeeqDZKdqdB-XDjIGE7YvsGw/view?usp=sharing)

## Histórico - AP2 (Dados persistentes com banco local)

<details>
<summary>Clique para expandir a documentação da AP2</summary>

# Atualização API Carros (AP2)

Projeto de API ASP.NET Core (.NET 10) integrada com Frontend HTML/JS/CSS e banco SQLite utilizando Entity Framework Core.

## Visão Geral do Projeto

O sistema permite gerir um cadastro de veículos através de operações completas de CRUD. 

* **Backend:** ASP.NET Core com Entity Framework Core e SQLite.
* **Frontend:** Interface Web servida na mesma origem da API (`wwwroot`).
* **Persistência:** Todos os dados alterados na interface ou via API ficam gravados no banco de dados local `api-carros.db`.

### Como Executar o Projeto

1. **Restaurar dependências e aplicar Migrations (Criar o Banco):**
    ```bash
    dotnet ef database update
    ```
   

2. **Executar a API (Backend):**
    ```bash
   dotnet run
   ```

3. **Executar a Interface Web (Frontend):**
   - Abra o arquivo `index.html`, que está em `wwwroot`  no VS Code.
   - Inicie o servidor local através da extensão **Live Server** (Go Live).

### Endpoints

| Método | Rota | Descrição | Status Esperado |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/carros` | Lista todos os carros | `200 OK` |
| **GET** | `/api/carros/{id}` | Busca um carro pelo ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/carros` | Cadastra um novo carro | `201 Created` |
| **PUT** | `/api/carros/{id}` | Atualiza um carro existente | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/carros/{id}` | Remove um carro | `204 No Content` / `404 Not Found` |

## Vídeo de demonstração do projeto atualizado:

[Clique aqui para assistir ao vídeo](https://drive.google.com/file/d/1SQTzetW1fA-JDg73XEt6d9bVrqVxPNZg/view?usp=sharing)

## Histórico - AP1 (Dados salvos em memória local)

<details>
<summary>Clique para expandir a documentação da AP1</summary>

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

## Vídeo de demonstração:

[Clique aqui para assistir ao vídeo](https://drive.google.com/file/d/1mFI7RkPs0DpBD74B0D0vCYjDm5mULFEv/view?usp=sharing)