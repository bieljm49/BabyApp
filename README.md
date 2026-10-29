# Diário do Meu Bebê

Aplicação web estática, mobile first, para registrar fraldas, mamadeira, amamentação e sono. Funciona imediatamente com `localStorage` e pode sincronizar opcionalmente com Google Planilhas por Google Apps Script.

## Uso local

Abra `index.html`. Para o service worker funcionar corretamente, use um servidor local ou publique no GitHub Pages.

## Publicação no GitHub Pages

1. Crie um repositório público no GitHub e envie todos os arquivos da raiz deste projeto.
2. No repositório, abra **Settings > Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main`, pasta `/root`, e salve.
5. Abra o endereço exibido pelo GitHub Pages.

## Banco opcional com Google Planilhas

1. Crie uma Planilha Google vazia.
2. Abra **Extensões > Apps Script**.
3. Substitua o conteúdo pelo arquivo `apps-script/Code.gs`.
4. Em configurações do projeto, use o fuso `America/Sao_Paulo`.
5. Clique em **Implantar > Nova implantação > Aplicativo da Web**.
6. Execute como você e defina quem pode acessar conforme a opção necessária para o navegador conseguir chamar a API.
7. Copie a URL terminada em `/exec`.
8. No app, abra **Ajustes**, cole a URL e toque em **Salvar e sincronizar**.

## Privacidade

- O modo local mantém os dados somente no navegador/aparelho.
- Limpar os dados do navegador pode remover os registros. Exporte backups regularmente.
- Uma implantação anônima do Apps Script facilita a sincronização, mas a URL atua como um endereço de acesso. Não há autenticação forte neste MVP.
- Não grave senhas no JavaScript ou no repositório.
- Evite informações médicas sensíveis, nome completo e fotos da criança em repositório público.
- Este aplicativo é um diário familiar, não um instrumento médico ou de diagnóstico.

## Estrutura

- `index.html`: registro rápido e resumo do dia
- `evolucao.html`: indicadores e gráficos
- `historico.html`: consulta e exclusão
- `configuracoes.html`: perfil, sincronização e backup
- `css/style.css`: visual rosa baby e responsivo
- `js/api.js`: armazenamento local e API
- `apps-script/Code.gs`: backend opcional para Planilhas Google

## Observação sobre ícones

O projeto usa emojis do próprio sistema para manter custo zero e evitar licenças de imagens. Eles podem ser substituídos depois por SVGs próprios.
