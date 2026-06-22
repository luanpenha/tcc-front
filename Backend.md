# Backend Specification — Sistema de Gerenciamento de Laboratórios Maker IFCE

## Objetivo

Desenvolver uma API REST utilizando **Node.js**, **Express.js**, **MongoDB** e **Mongoose** para atender o sistema de gerenciamento dos Laboratórios Maker do IFCE.

A API será responsável por:

* Autenticação de usuários
* Controle de permissões
* Gerenciamento de usuários
* Gerenciamento de laboratórios
* Gerenciamento de agendamentos
* Gerenciamento de solicitações de impressão 3D
* Gerenciamento da galeria de projetos
* Dashboard administrativo
* Controle de estoque de materiais

---

# Stack Tecnológica

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Segurança

* JWT (JSON Web Token)
* bcrypt para hash de senhas

## Upload de Arquivos

* Multer

---

# Controle de Permissões

O sistema possui apenas dois níveis de acesso.

## Student

Usuário comum (aluno).

## Admin

Administrador do sistema (professores e monitores).

---

# Autenticação

## Cadastro de Usuário

Permitir criação de novos usuários.

### Campos

* Nome completo
* E-mail institucional
* Matrícula
* Curso
* Senha

### Regras

* E-mail deve ser único
* Matrícula deve ser única
* Senha mínima de 8 caracteres

---

## Login

Permitir autenticação utilizando:

* E-mail
* Senha

### Retorno

```json
{
  "token": "",
  "user": {},
  "role": "student"
}
```

---

## Modelo de Usuário

```json
{
  "name": "",
  "email": "",
  "registration": "",
  "course": "",
  "password": "",
  "role": "student",
  "createdAt": "",
  "updatedAt": ""
}
```

### Roles possíveis

```txt
student
admin
```

---

# Controle de Usuários

## Student

Pode:

* Visualizar próprio perfil
* Editar próprios dados
* Alterar senha

---

## Admin

Pode:

* Listar usuários
* Buscar usuário por ID
* Editar usuários
* Alterar permissões
* Remover usuários
* Ativar ou desativar usuários

---

# Laboratórios

Gerenciamento dos laboratórios maker cadastrados.

---

## Informações do Laboratório

```json
{
  "name": "",
  "location": "",
  "description": "",
  "capacity": 0,
  "resources": [],
  "status": "active"
}
```

---

## Status possíveis

```txt
active
maintenance
inactive
```

---

## Student

Pode:

* Listar laboratórios
* Visualizar detalhes

---

## Admin

Pode:

* Criar laboratório
* Editar laboratório
* Remover laboratório
* Alterar status

---

# Agendamentos

Permitir reserva de horários dos laboratórios.

---

## Estrutura

```json
{
  "user": "",
  "laboratory": "",
  "date": "",
  "startTime": "",
  "endTime": "",
  "status": "pending"
}
```

---

## Status possíveis

```txt
pending
approved
cancelled
completed
```

---

## Student

Pode:

* Criar agendamento
* Visualizar próprios agendamentos
* Cancelar próprios agendamentos

---

## Admin

Pode:

* Visualizar todos os agendamentos
* Editar agendamentos
* Aprovar agendamentos
* Cancelar agendamentos
* Excluir agendamentos
* Bloquear horários

---

## Regras de Negócio

Não permitir:

* Horários sobrepostos
* Datas passadas
* Horários fora do funcionamento do laboratório
* Agendamentos em laboratórios inativos ou em manutenção

---

# Solicitações de Impressão 3D

Permitir envio de arquivos para impressão.

---

## Estrutura

```json
{
  "user": "",
  "title": "",
  "description": "",
  "file": "",
  "material": "",
  "quantity": 1,
  "status": "pending"
}
```

---

## Status possíveis

```txt
pending
approved
printing
finished
ready_for_pickup
delivered
rejected
```

---

## Student

Pode:

* Criar solicitação
* Visualizar próprias solicitações
* Acompanhar status

---

## Admin

Pode:

* Visualizar todas as solicitações
* Aprovar solicitações
* Rejeitar solicitações
* Atualizar status
* Remover solicitações

---

## Uploads Permitidos

### Impressão 3D

* STL
* OBJ

### Limitações

* Validar tamanho máximo do arquivo
* Armazenar caminho do arquivo no banco

---

# Materiais e Estoque

Controle dos materiais utilizados no laboratório.

---

## Estrutura

```json
{
  "name": "",
  "quantity": 0,
  "unit": "",
  "minimumQuantity": 0
}
```

---

## Exemplos

* PLA
* PETG
* Resina
* Componentes eletrônicos

---

## Student

Pode:

* Apenas visualizar disponibilidade

---

## Admin

Pode:

* Cadastrar material
* Editar material
* Atualizar estoque
* Remover material

---

# Galeria de Projetos

Permitir exibição de projetos produzidos no laboratório.

---

## Estrutura

```json
{
  "title": "",
  "description": "",
  "images": [],
  "author": "",
  "createdAt": ""
}
```

---

## Student

Pode:

* Visualizar galeria

---

## Admin

Pode:

* Criar projeto
* Editar projeto
* Remover projeto
* Fazer upload de imagens

---

# Dashboard Administrativo

Criar endpoints para fornecer informações consolidadas.

---

## Indicadores

* Total de usuários
* Total de laboratórios
* Total de agendamentos
* Agendamentos do dia
* Impressões pendentes
* Impressões em andamento
* Impressões concluídas
* Materiais cadastrados

---

# Logs do Sistema

Registrar ações importantes para auditoria.

Exemplos:

* Login
* Cadastro de usuário
* Criação de agendamento
* Cancelamento de agendamento
* Aprovação de impressão
* Alteração de status
* Exclusão de registros

---

# Middleware de Autorização

## authMiddleware

Responsável por:

* Validar JWT
* Identificar usuário autenticado

Aplicado em todas as rotas privadas.

---

## adminMiddleware

Responsável por:

* Verificar se o usuário possui role "admin"

Aplicado em todas as rotas administrativas.

---

# Padrão de Resposta da API

## Sucesso

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": {}
}
```

---

## Erro

```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

---

# Requisitos Técnicos

## Arquitetura

Utilizar arquitetura em camadas:

* Routes
* Controllers
* Services
* Models
* Middlewares

---

## Banco de Dados

Utilizar Mongoose para modelagem dos documentos.

Relacionamentos entre entidades devem utilizar referências (`ObjectId`) quando necessário.

---

## Segurança

Implementar:

* JWT Authentication
* Hash de senhas com bcrypt
* Middleware de autorização
* Proteção de rotas privadas
* Validação de entrada de dados

---

# Objetivo Final

A API deve fornecer toda a infraestrutura necessária para o funcionamento do sistema de Laboratórios Maker do IFCE, permitindo que alunos realizem agendamentos e solicitações de impressão, enquanto administradores gerenciam usuários, laboratórios, materiais, impressões e indicadores do sistema através de uma área administrativa centralizada.
