# 🚒 Alerta Conecta

## 📘 Sobre o Projeto
O *Alerta Conecta* é um sistema desenvolvido para o *Corpo de Bombeiros Militar de Pernambuco, com o objetivo de otimizar o **gerenciamento de ocorrências, **endereços* e *usuários, garantindo uma **comunicação ágil e eficiente* entre as unidades operacionais.

O sistema foi criado para facilitar o registro, acompanhamento e análise de ocorrências em tempo real, integrando diferentes setores por meio de uma plataforma web moderna e segura.

---

## 🏗 Arquitetura do Sistema

O sistema adota uma *arquitetura em camadas (Cliente-Servidor), seguindo o modelo **MVC (Model-View-Controller)*:

### 🔹 Frontend
- Desenvolvido em React, TypeScript, TailwindCss e Vite + Shadcn/ui.
- Responsável pela *interface com o usuário*.
- Oferece telas intuitivas para registro, acompanhamento e consulta de ocorrências.

### 🔹 Backend
- Desenvolvido em *Java (Spring Boot)*.
- Gerencia as *regras de negócio, **autenticação* e *comunicação com o banco de dados*.
- Disponibiliza *APIs REST* para integração com o frontend.

### 🔹 Banco de Dados
- Utiliza *MySQL*.
- Armazena informações sobre usuários, funcionários, endereços e ocorrências.
- Modelagem relacional que garante integridade e consistência dos dados.

---

## 🔄 Fluxo de Dados

O fluxo segue o padrão:


O *frontend* envia requisições HTTP ao *backend, que processa as regras de negócio e realiza consultas no **banco de dados*.  
As respostas retornam em formato *JSON*, exibidas ao usuário em tempo real.

---

## ⚙ APIs e Controladores

### *UserDataController*
Gerencia as operações relacionadas aos *usuários* do sistema.

*Principais funções:*
- Cadastro e autenticação de usuários;
- Listagem e atualização de informações;
- Controle de permissões e perfis de acesso.

---

### *OccurrenceDataController*
Responsável pela manipulação de *ocorrências*.

*Principais funções:*
- Registro e atualização de ocorrências;
- Consulta de ocorrências registradas;
- Atualização de status (em andamento, finalizada);
- Associação entre usuários e endereços.

---

### *Camadas de Serviço*
Classes como *OccurrenceManage* e *UserManage* intermediam a comunicação entre controladores e banco de dados, centralizando as regras de negócio e garantindo um código mais limpo e organizado.

---

## 🧩 Estrutura do Banco de Dados (MySQL)

A modelagem segue o paradigma *relacional*, com as principais entidades:

| Entidade | Descrição |
|-----------|------------|
| *User* | Armazena dados de usuários e funcionários (nome, email, senha, cargo). |
| *Funcionario* | Representa os bombeiros e agentes responsáveis pelas ocorrências. |
| *Occurrence* | Registra as ocorrências (status, tipo, data, descrição). |
| *OccurrenceType* | Define os tipos de ocorrência (ex: incêndio, salvamento, resgate). |
| *Endereco* | Contém informações geográficas (rua, cidade, estado, coordenadas). |
| *OccurrenceAddress* | Faz a ligação entre ocorrência e endereço. |

*Relacionamentos principais:*
- 1:N entre *Usuário → Ocorrência*  
- N:1 entre *Ocorrência → Tipo* e *Ocorrência → Endereço*

---

## 🔐 Segurança e Integração

- *Autenticação JWT (JSON Web Token)* para proteger rotas e dados sensíveis.  
- Comunicação segura via *HTTPS*.  
- Estrutura modularizada que facilita manutenção e escalabilidade.  
- Potencial de integração com *APIs externas* (geolocalização, notificações em tempo real, etc).

---

## 🧠 Boas Práticas Implementadas

- Separação clara entre *camadas de controle, serviço e modelo*.  
- Uso de *Spring Boot* com *JPA/Hibernate* para persistência.  
- *Validação de dados* e *tratamento de exceções* centralizado.  
- Código limpo e organizado, com padronização de nomenclatura e responsabilidades.

---

## ✅ Conclusão

O *Alerta Conecta* apresenta uma *arquitetura sólida, segura e escalável*, adequada para aplicações corporativas de missão crítica.  
A integração entre *ReactJS, Spring Boot e MySQL* garante desempenho e confiabilidade no gerenciamento de ocorrências.

Os próximos passos incluem:
- Expansão da *documentação das APIs*;  
- Implementação de *testes automatizados*;  
- Criação de *rotinas de backup* e otimização de consultas;  
- Desenvolvimento de *integrações com sistemas externos* de geolocalização e alertas.

---

## 👨‍💻 Desenvolvido por
Equipe de Projeto Integrador — *Corpo de Bombeiros Militar*

Integrantes:
- Pedro Enrico  
- Júlio César Martins da Cunha  
- Vinícius Fernandes  
- Pedro Moura 
- Larissa Beatriz
- Eduardo Pereira
- Reideclildon Paulo

---

## 📄 Licença
Este projeto é de uso acadêmico e institucional, voltado para o Corpo de Bombeiros Militar de Pernambuco.  
A redistribuição e modificação do código devem respeitar as normas da instituição e as boas práticas de desenvolvimento seguro.
