![RefundMe](docs/banner-refundme.png)

# RefundMe - API (Backend)

Este repositório contém a **API do projeto RefundMe**, responsável pelo processamento das solicitações e despesas, autenticação de usuários e integração com serviços externos.

## 📌 Objetivo

Fornecer uma API robusta e escalável para a aplicação RefundMe, permitindo o gerenciamento de projetos, usuários, solicitações e despesas com persistência na nuvem.

## 🛠️ Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) - Framework backend Node.js com TypeScript
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/) como banco de dados NoSQL
- [Mongoose](https://mongoosejs.com/) para ORM
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para hospedagem na nuvem
- AWS:
  - [Amazon S3](https://aws.amazon.com/s3/) para upload e armazenamento de comprovantes
  - [Amazon EC2](https://aws.amazon.com/ec2/) para hospedagem da API

## 🔄 Fluxo do Sistema

- Um **Projeto** pode conter múltiplas **Solicitações**
- Cada **Solicitação** pode conter múltiplas **Despesas**
- As despesas podem ser por **valor direto** ou por **quantidade** (ex: km)
- A API valida limites de valor e status de aprovação
- Upload de comprovantes é feito via **Amazon S3**

## 🔐 Autenticação

- JWT Token
- Diferenciação de acesso entre usuários **ADMIN** e **comuns**

## 📚 Documentação

- A documentação completa da API está disponível via Swagger em `/api` com a aplicação em funcionamento.
