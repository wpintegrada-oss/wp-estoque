# WP ESTOQUE

Sistema independente de gestão de produtos, estoque, compras e vendas da WP Integrada.

## Requisitos
- Node.js 20 ou superior
- npm
- Projeto Firebase próprio

## Instalação
```bash
npm install
cp .env.example .env.local
npm run dev
```

Preencha `.env.local` com as configurações do aplicativo Web Firebase.

## Scripts
- `npm run dev`: desenvolvimento local
- `npm run build`: valida TypeScript e gera a versão de produção
- `npm run preview`: visualiza a versão de produção localmente

## Estrutura inicial
- Dashboard responsivo
- Navegação dos módulos
- Configuração Firebase preparada
- Tipos iniciais para empresa, produto e movimentação
- Regras Firestore iniciais fechadas por padrão

## Segurança — importante
As regras do Firestore deste scaffold bloqueiam gravações pelo cliente intencionalmente. Antes de cadastrar empresas, produtos, movimentações ou vendas, implemente funções confiáveis no backend (Cloud Functions ou servidor autenticado) para validar a associação do usuário à empresa e aplicar operações atômicas.

Não libere gravações gerais no Firestore para fazer a interface "funcionar". Não coloque chaves privadas ou service account no frontend.

## Próximas etapas
1. Configurar Firebase Authentication.
2. Criar fluxo seguro de provisionamento da primeira empresa e do administrador.
3. Implementar serviços de produtos e categorias.
4. Implementar movimentações atômicas.
5. Implementar PDV com baixa de estoque e cancelamento/estorno auditável.
6. Criar testes de regras e funções.
