# Desk AI - Documentação do Projeto

## Descrição da Aplicação

O **Desk AI** é um sistema moderno de Help Desk integrado com inteligência artificial, desenvolvido para otimizar o atendimento ao cliente e facilitar a gestão de chamados (tickets). A plataforma oferece um ambiente centralizado onde clientes podem relatar problemas ou dúvidas e a equipe de suporte pode gerenciá-los com eficiência.

A arquitetura do projeto é dividida em duas camadas principais:
- **Frontend**: Uma SPA (Single Page Application) responsiva desenvolvida com **React 19, Vite, TypeScript e Tailwind CSS**. A interface adapta suas rotas e painéis dinamicamente com base no perfil de acesso do usuário logado.
- **Backend**: Uma **API REST** robusta desenvolvida em **Python** utilizando **Django 6.x** e **Django REST Framework**. Toda a comunicação é protegida por autenticação via **JWT (JSON Web Tokens)**.
- **Módulo de IA**: Integração com a API do **Google Gemini** para fornecer superpoderes à equipe de atendimento, como sugestões de respostas, resumos de histórico e categorização inteligente.

O sistema possui controle de acesso baseado em três perfis:
1. **Administrador (`admin`)**: Possui acesso total ao sistema, gerencia os usuários e administra as categorias globais de chamados.
2. **Agente (`agent`)**: Responsável por tratar e responder os chamados, com permissão para alterar status, adicionar notas internas exclusivas para a equipe e utilizar os recursos da Inteligência Artificial.
3. **Cliente (`client`)**: Usuário final que pode registrar-se, abrir novos chamados, anexar arquivos e interagir através de comentários apenas nos próprios tickets.

---

## Histórias de Usuário Implementadas

### Módulo de Autenticação e Conta
- **Como um usuário**, eu quero fazer login com meu e-mail e senha para acessar meu dashboard de forma segura.
- **Como um novo usuário (cliente)**, eu quero poder criar uma conta no sistema para começar a abrir chamados de suporte.
- **Como um usuário logado**, eu quero visualizar e atualizar as configurações da minha conta e acessar meu avatar na plataforma.

### Módulo do Cliente (`client`)
- **Como um cliente**, eu quero poder criar um novo ticket (chamado), preenchendo o título e a descrição do problema, para receber ajuda do suporte.
- **Como um cliente**, eu quero ter acesso a uma lista com todos os chamados que eu já abri para acompanhar facilmente a situação atual de cada um.
- **Como um cliente**, eu quero poder entrar na página de detalhes de um chamado meu para ler as respostas da equipe de atendimento.
- **Como um cliente**, eu quero poder enviar novos comentários e fazer upload de anexos em um chamado aberto para fornecer informações adicionais.

### Módulo do Agente de Suporte (`agent`)
- **Como um agente**, eu quero visualizar uma lista de todos os chamados registrados no sistema para saber quais demandas estão pendentes de atendimento.
- **Como um agente**, eu quero poder atualizar propriedades do ticket (como status, prioridade e categoria) para manter o fluxo de trabalho organizado.
- **Como um agente**, eu quero poder atribuir a responsabilidade de um ticket para mim mesmo ou para outro membro da equipe.
- **Como um agente**, eu quero poder escrever "Notas Internas" nos comentários de um ticket, garantindo que essas mensagens só sejam lidas por outros agentes ou admins e fiquem ocultas para o cliente.
- **Como um agente**, eu quero poder enviar comentários públicos para dialogar com o cliente e notificar a resolução do problema.

### Módulo de Inteligência Artificial (Gemini)
- **Como um agente**, eu quero que a IA sugira automaticamente a melhor categoria para um ticket recém-aberto (baseado no título e descrição) para economizar tempo na triagem.
- **Como um agente**, eu quero receber uma sugestão de resposta educada e profissional formulada pela IA para que eu possa responder o cliente mais rapidamente.
- **Como um agente**, eu quero ter a opção de gerar um resumo executivo (em até 5 linhas) do histórico completo de um ticket, para entender o contexto rapidamente ao assumir um chamado longo.

### Módulo do Administrador (`admin`)
- **Como um administrador**, eu quero ter uma interface para gerenciar usuários (listar, editar perfil, ativar/desativar conta) para manter o controle sobre o acesso de funcionários e clientes à plataforma.
- **Como um administrador**, eu quero gerenciar as categorias do sistema (criando novas ou alterando cor, nome e descrição) para estruturar os assuntos de suporte da empresa.
- **Como um administrador**, eu quero ter acesso irrestrito a todos os chamados e recursos, incluindo notas internas e relatórios, para poder supervisionar a operação inteira.
