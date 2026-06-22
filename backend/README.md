# Backend API — Sistema de Laboratórios Maker IFCE

Este backend implementa a API REST do sistema de gerenciamento Maker IFCE descrito em `Backend.md`.

## Tecnologias

* Node.js
* Express.js
* MongoDB / Mongoose
* JWT para autenticação
* bcrypt para hash de senhas
* Multer para upload de arquivos

## Como usar

1. Copie `.env.example` para `.env`.
2. Ajuste `MONGO_URI` e `JWT_SECRET`.
3. Execute `npm install`.
4. Inicie com `npm run dev` ou `npm start`.

## Endpoints principais

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/profile`
* `GET /api/users`
* `GET /api/laboratories`
* `POST /api/bookings`
* `POST /api/prints`
* `GET /api/materials`
* `GET /api/gallery`
* `GET /api/dashboard`

As rotas administrativas exigem token JWT e role `admin`.
