# Design System — GabiOS

## Overview

GabiOS utiliza um design system moderno, minimalista e focado em **dark mode como padrão**. Todas as interfaces seguem a paleta de cores de contraste alto para acessibilidade, com tipografia clara e espaçamentos consistentes.

**Tecnologia:** Tailwind CSS v4 + Next.js 15
**Dark Mode:** Ativado por padrão (`class` mode)

---

## Paleta de Cores

### Base (Backgrounds)

| Nome | Valor | Uso |
|------|-------|-----|
| `bg-gray-950` | #030712 | Fundo principal do body |
| `bg-gray-900` | #111827 | Fundo de páginas/containers |
| `bg-gray-800` | #1f2937 | Fundo de cards, inputs, sidebars |
| `bg-gray-700` | #374151 | Fundo de elementos secundários, badges |

### Texto (Text)

| Nome | Valor | Uso |
|------|-------|-----|
| `text-white` | #ffffff | Títulos, destaque principal |
| `text-gray-100` | #f3f4f6 | Texto principal do body |
| `text-gray-300` | #d1d5db | Rótulos de inputs, badges |
| `text-gray-400` | #9ca3af | Texto secundário, hints |
| `text-gray-500` | #6b7280 | Texto terciário, metadata |
| `text-gray-600` | #4b5563 | Separadores, dividers |

### Primária (Ações)

| Nome | Valor | Uso |
|------|-------|-----|
| `bg-blue-600` | #2563eb | Botões principais, CTAs |
| `bg-blue-700` | #1d4ed8 | Hover state de botões |
| `bg-blue-400` | #60a5fa | Links, destaques, loading |
| `text-blue-400` | #60a5fa | Links em texto |

### Status (Feedback)

| Nome | Valor | Uso |
|------|-------|-----|
| `text-green-400` | #4ade80 | Sucesso, documento pronto |
| `bg-green-500/10` | rgba(34, 197, 94, 0.1) | Background de badge sucesso |
| `text-yellow-400` | #facc15 | Aviso, processando |
| `bg-yellow-500/10` | rgba(234, 179, 8, 0.1) | Background de badge aviso |
| `text-red-400` | #f87171 | Erro, crítico |
| `bg-red-500/10` | rgba(239, 68, 68, 0.1) | Background de badge erro |

### Borders

| Nome | Valor | Uso |
|------|-------|-----|
| `border-gray-700` | #374151 | Bordas principais |
| `border-gray-600` | #4b5563 | Bordas de inputs em focus |

---

## Tipografia

### Font Family

```css
font-family: system-ui, -apple-system, sans-serif;
```

Sistema de fonts nativo do sistema operacional para melhor compatibilidade e performance.

### Escala de Tamanhos

| Classe | Tamanho | Peso | Uso |
|--------|---------|------|-----|
| `text-3xl` | 30px | bold (700) | Títulos de página |
| `text-xl` | 20px | bold (700) | Subtítulos de seção |
| `text-lg` | 18px | semibold (600) | Títulos de cards, nomes de clientes |
| `text-sm` | 14px | normal (400) | Texto de corpo, labels |
| `text-xs` | 12px | normal (400) | Metadata, timestamps, badges |

### Pesos

- **Bold (700):** Títulos principais (`text-3xl`, `text-xl`)
- **Semibold (600):** Subtítulos (`text-lg`, card titles)
- **Normal (400):** Corpo, labels, metadata

---

## Espaçamentos

### Padding

| Classe | Valor | Uso |
|--------|-------|-----|
| `p-2` | 8px | Padding em badges, small elements |
| `p-4` | 16px | Padding em cards secundários |
| `p-6` | 24px | Padding em cards principais, modals |
| `p-8` | 32px | Padding em containers de página |
| `px-2 py-1` | 8px 4px | Badges, small components |
| `px-3 py-2` | 12px 8px | Input buttons, small buttons |
| `px-4 py-2` | 16px 8px | Botões principais |

### Gaps (entre items flexbox)

| Classe | Valor | Uso |
|--------|-------|-----|
| `gap-1` | 4px | Entre ícones e texto em small items |
| `gap-2` | 8px | Entre ícones e texto em items normais |
| `gap-4` | 16px | Entre buttons, major components |

### Margins

| Classe | Valor | Uso |
|--------|-------|-----|
| `mb-1` | 4px | Micro spacing |
| `mb-2` | 8px | Espaço entre labels e inputs |
| `mb-4` | 16px | Espaço entre sections |
| `mb-6` | 24px | Espaço grande entre sections |
| `mt-1` | 4px | Espaço acima de text |
| `pt-3` | 12px | Espaço acima de dividers |
| `pb-4` | 16px | Espaço abaixo de dividers |

---

## Componentes

### Botões

#### Botão Primário (CTA)

```html
<button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
  Ação Primária
</button>
```

**Propriedades:**
- Background: `bg-blue-600`
- Hover: `hover:bg-blue-700`
- Disabled: `disabled:bg-gray-600`
- Padding: `px-4 py-2`
- Border: `rounded` (padrão 4px)
- Texto: `text-white`
- Transição: `transition` (0.3s smooth)

### Cards

```html
<div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
  <h3 class="text-lg font-semibold text-white mb-2">Título</h3>
  <p class="text-sm text-gray-400">Conteúdo</p>
</div>
```

**Propriedades:**
- Background: `bg-gray-800`
- Border: `border border-gray-700`
- Radius: `rounded-lg` (8px)
- Padding: `p-6` (24px)
- Hover: `hover:bg-gray-750 hover:border-gray-600` (elevação)

### Inputs & Forms

```html
<input
  type="text"
  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
  placeholder="Digite algo..."
/>
```

**Propriedades:**
- Background: `bg-gray-700`
- Border: `border border-gray-600`
- Focus: `focus:border-blue-500` (destaque)
- Texto: `text-white`
- Placeholder: `placeholder-gray-500`
- Padding: `px-3 py-2` (12px 8px)
- Radius: `rounded` (4px)

### Badges & Tags

#### Status Badge (Success)

```html
<span class="inline-block px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded">
  Pronto
</span>
```

**Variantes:**
- Success: `bg-green-500/10 text-green-400`
- Warning: `bg-yellow-500/10 text-yellow-400`
- Error: `bg-red-500/10 text-red-400`
- Neutral: `bg-gray-500/10 text-gray-400`

**Propriedades:**
- Padding: `px-2 py-1` (8px 4px)
- Tamanho: `text-xs` (12px)
- Radius: `rounded` (4px)

### Modal

```html
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
    <h2 class="text-xl font-bold text-white mb-4">Título</h2>
    <!-- Conteúdo -->
  </div>
</div>
```

**Propriedades:**
- Backdrop: `bg-black/50`
- Container: `bg-gray-800 border border-gray-700 rounded-lg`
- Width: `w-96` (384px, fixo para modals)
- Padding: `p-6` (24px)
- Z-index: `z-50`

### Layout 3-Column

```html
<div class="h-screen bg-gray-900 flex overflow-hidden">
  <!-- Sidebar Left: 240px -->
  <div class="w-60 border-r border-gray-700 bg-gray-800 flex flex-col overflow-hidden">
    <!-- conteúdo -->
  </div>

  <!-- Main Center: Flexível -->
  <div class="flex-1 flex flex-col overflow-hidden border-r border-gray-700">
    <!-- conteúdo -->
  </div>

  <!-- Sidebar Right: 280px -->
  <div class="w-70 border-l border-gray-700 bg-gray-800 flex flex-col overflow-hidden">
    <!-- conteúdo -->
  </div>
</div>
```

**Propriedades:**
- Altura: `h-screen` (viewport full)
- Background: `bg-gray-900`
- Layout: `flex overflow-hidden` (sem scrollbars)
- Dividers: `border-r border-gray-700`
- Sidebars: `bg-gray-800`

---

## Estados & Interações

### Hover States

| Elemento | Normal | Hover |
|----------|--------|-------|
| Botão | `bg-blue-600` | `hover:bg-blue-700` |
| Card | `bg-gray-800` | `hover:bg-gray-750` |
| Link | `text-blue-400` | `hover:underline` |

### Focus States

| Elemento | Focus |
|----------|-------|
| Input | `focus:border-blue-500 focus:outline-none` |
| Button | `focus:outline-none focus:ring-2 focus:ring-blue-400` |

### Disabled States

| Elemento | Disabled |
|----------|----------|
| Button | `disabled:bg-gray-600 disabled:opacity-50` |
| Input | `disabled:opacity-50` |

### Loading States

```html
<Loader class="w-4 h-4 text-blue-400 animate-spin" />
```

- Ícone: `animate-spin` (rotação contínua)
- Cor: `text-blue-400` (primária)
- Tamanho: `w-4 h-4` ou `w-8 h-8` conforme contexto

---

## Transições & Animações

### Transições Padrão

```css
transition /* 0.3s cubic-bezier(0.4, 0, 0.2, 1) */
```

Aplicada a hover states, focus states, etc.

### Animações

| Classe | Efeito | Uso |
|--------|--------|-----|
| `animate-pulse` | Fade in/out | Skeleton loaders |
| `animate-spin` | Rotação | Loaders de status |

---

## Acessibilidade

### Contraste de Cores

Todas as combinações respeitam WCAG AA (contraste ≥ 4.5:1):
- Texto branco em fundo cinza: ✅ 11.5:1
- Texto cinza-400 em fundo cinza-900: ✅ 6.5:1

### Estados Visuais

- ✅ Focus states claramente visíveis
- ✅ Disabled estados com opacidade/cor reduzida
- ✅ Ícones com texto alternativo
- ✅ Tamanhos de clique (min. 44px²)

---

## Responsividade

### Breakpoints

| Breakpoint | Tamanho | Uso |
|-----------|---------|-----|
| `sm` | 640px | Mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |

### Padrões

```html
<!-- Grid responsivo -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Cards -->
</div>

<!-- Sidebar responsivo -->
<div class="w-60 md:w-80 lg:w-96">
  <!-- conteúdo -->
</div>
```

---

## Exemplo Prático

### Card de Cliente (Folha de Estilo Completa)

```html
<button class="text-left bg-gray-800 hover:bg-gray-750 rounded-lg p-6 transition border border-gray-700 hover:border-gray-600">
  <!-- Título -->
  <h3 class="text-lg font-semibold text-white mb-2 truncate">
    Nome do Cliente
  </h3>

  <!-- Setor Badge -->
  <div class="mb-3">
    <span class="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
      Tecnologia
    </span>
  </div>

  <!-- Documentos e Status -->
  <div class="mb-4">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-400">3 documentos</span>
      <span class="text-gray-600">·</span>
      <div class="flex items-center gap-1">
        <CheckCircle class="w-4 h-4 text-green-400" />
        <span class="text-sm text-gray-400">Pronto</span>
      </div>
    </div>
  </div>

  <!-- Contexto -->
  <div class="mb-4 pb-4 border-t border-gray-700">
    <div class="mt-3">
      <p class="text-xs text-gray-500 mb-1">Template</p>
      <p class="text-sm text-blue-400">B2B SaaS Growth</p>
    </div>
    <div class="mt-2">
      <span class="inline-block px-2 py-1 text-xs rounded bg-green-500/10 text-green-400">
        Contexto Completo
      </span>
    </div>
  </div>

  <!-- Data -->
  <div class="text-xs text-gray-500 pt-3 border-t border-gray-700">
    15 de mar, 2026
  </div>
</button>
```

---

## Checklist de Conformidade

Ao criar novos componentes, verificar:

- [ ] Dark mode funciona (`class="dark"`)
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Estados hover/focus visíveis
- [ ] Padding/margins consistentes com escala
- [ ] Tipografia usa escala definida
- [ ] Cores vêm da paleta (sem cores hardcoded)
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Icons têm tamanhos consistentes (w-4, w-8)
- [ ] Transições suaves (`transition`)
- [ ] Acessibilidade básica (alt text, labels)

---

## Changelog

| Data | Versão | Mudanças |
|------|--------|----------|
| 2026-03-15 | 1.0.0 | Design System inicial criado baseado em análise do projeto existente |

