# Migrações de Banco de Dados
Este projeto utiliza migrações de banco de dados para gerenciar as alterações no esquema. Nós usamos o TypeORM como nosso ORM, que fornece um sistema de migração poderoso.
Executando as Migrações
Para executar as migrações, siga estas etapas:

**Certifique-se de ter os últimos commits do repositório:**
*git pull*

**Instale as dependências do projeto, caso ainda não tenha feito:**
*npm install*

**Execute o comando de migração:**
*npm run typeorm migration:run*
Isso irá executar todas as migrações pendentes e aplicar as alterações no seu banco de dados.

Criando uma Nova Migração
Para criar uma nova migração, use o seguinte comando:
Copynpm run typeorm migration:create -- -n NomeDaMigracao
Isso irá gerar um novo arquivo de migração no diretório src/migrations. O arquivo terá um nome semelhante a 1663394071894-NomeDaMigracao.ts.
Atualizando uma Migração Existente
Se você precisar fazer alterações em uma migração existente, você pode editar o arquivo de migração diretamente. Lembre-se de atualizar o timestamp da migração no nome do arquivo para garantir que a ordem de execução esteja correta.
Revertendo Migrações
Para reverter a última migração executada, use o seguinte comando:
Copynpm run typeorm migration:revert
Isso irá desfazer as alterações feitas pela última migração executada.
Melhores Práticas

Mantenha as migrações atômicas: cada migração deve lidar com uma única e coerente alteração no esquema do banco de dados.
Use nomes de migração descritivos: use um nome que descreva claramente o propósito da migração.
Teste as migrações localmente: sempre teste suas migrações localmente antes de enviá-las para o repositório.
Evite modificar migrações já executadas: se você precisar alterar uma migração já executada, crie uma nova migração que reverta as alterações e então aplique as novas.
Documente as alterações das migrações: atualize este arquivo README com quaisquer alterações significativas no processo de migração ou no esquema.

Esse arquivo README fornece uma visão geral de como usar as migrações de banco de dados em seu projeto. Ele cobre os comandos essenciais para executar, criar e reverter migrações, bem como algumas melhores práticas a serem consideradas. Sinta-se à vontade para personalizar este documento de acordo com os requisitos específicos do seu projeto.