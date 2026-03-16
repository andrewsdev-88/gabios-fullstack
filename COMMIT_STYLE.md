# Padrão de Commits - GabiOS

Usamos **Conventional Commits** para manter histórico claro e rastreável.

## Formato

```
<tipo>: <descrição breve>

<corpo opcional>

<rodapé opcional>
```

## Tipos

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alteração em documentação
- **style**: Formatação, linting (sem mudança de código)
- **refactor**: Refatoração de código sem nova feature
- **perf**: Melhoria de performance
- **test**: Adição ou atualização de testes
- **chore**: Atualização de dependências, config

## Exemplos

```
feat: implementar chat com streaming SSE
fix: corrigir Tailwind v4 não renderizando estilos
docs: adicionar guia de instalação do Supabase
refactor: extrair lógica de RAG para arquivo separado
```

## Branches

- `master` - Production ready (releases)
- `develop` - Development branch
- `feature/*` - Novas features
- `fix/*` - Bug fixes
- `hotfix/*` - Hotfixes críticos

## Workflow

1. Criar branch: `git checkout -b feature/nome-da-feature`
2. Fazer commits com padrão convencional
3. Push para develop
4. Criar PR para review
5. Após merge, deletar branch
