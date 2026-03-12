# TechCorp Dashboard

> Interface de gestion des outils SaaS internes — Test technique 3 jours

---

## 🚀 Quick Start

```bash
# Cloner le projet
git clone https://github.com/YoCode35/techcorp-dashboard.git
cd techcorp-dashboard

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application est accessible sur **`http://localhost:5173`**

**Stack :** React 18 · Vite · Tailwind CSS v4 · TanStack Query · React Router DOM · Recharts · Vitest

---

## 🏗️ Architecture

### Structure du projet

```
src/
├── components/
│   ├── charts/          # Recharts — SpendLineChart, DepartmentPieChart, TopToolsBarChart
│   ├── features/
│   │   ├── dashboard/   # KPICards, RecentTools, SkeletonDashboard
│   │   └── tools/       # ToolsTable, ToolsFilters, ToolsModal, ToolsDetail
│   ├── insights/        # InsightKPI, AlertCard
│   ├── layout/          # Header, MobilePageHeader
│   └── ui/              # Button, Badge, Input, Select, Card, Textarea, ErrorState
├── hooks/
│   └── useTools.js      # Hooks TanStack Query
├── pages/
│   ├── Dashboard.jsx
│   ├── Tools.jsx
│   └── Analytics.jsx
├── styles/
│   └── globals.css
├── tests/               # 99 tests unitaires
└── utils/
    ├── api.js
    ├── constants.js
    └── helpers.js
```

### Organisation sur 3 jours

| Jour | Focus | Livrables |
|---|---|---|
| **Jour 6** | Foundation | Setup Vite, Tailwind v4, React Router, TanStack Query, design tokens | Dashboard | KPICards, RecentTools, Header, dark mode, skeleton loading | Design System | Button, Badge, Input, Select, Card, Textarea + refactor composants |
| **Jour 7** | Tools Catalog | ToolsTable, ToolsFilters, ToolsModal, ToolsDetail, CRUD complet |
| **Jour 8** | Analytics | Charts Recharts, InsightKPI, AlertCard, ROI, navigation cross-page |

---

## 🎨 Design System Evolution

Le design system a été construit de façon **incrémentale**, en extrayant les patterns répétés au fil des pages.

### Composants UI (`src/components/ui/`)

| Composant | Variants | Usage |
|---|---|---|
| `Button` | primary, secondary, danger, ghost, warning · xs→lg | Actions CRUD, navigation, bulk operations |
| `Badge` | active, expiring, unused, violet, gray | Statuts outils dans toutes les vues |
| `Input` | avec/sans icône | Search bars, formulaires modal |
| `Select` | dropdown custom dark mode | Filtres, tri, sélecteurs |
| `Card` | gradient hover | KPI cards, conteneurs analytics |
| `Textarea` | resize-none | Champs description dans les modals |

### Palette dark mode

```
Fond pages         #0a0a0a  (bg-grid avec quadrillage subtil)
Header             #000000  (bg-black)
Cards / Tableaux   #000000  (bg-black)
Inputs             #151515  (bg-[#151515])
Borders            white/10 (rgba blanc 10%)
Accent             violet-500
```

### Principes appliqués

- **DRY** — toutes les valeurs partagées centralisées dans `constants.js`
- **clsx** — gestion conditionnelle des classes sans concaténation fragile
- **Cohérence** — mêmes espacements, radius et transitions sur les 3 pages
- **Dark-first** — toutes les variantes dark définies dès la création des composants

---

## 🔗 Navigation & User Journey

### Flow utilisateur complet

```
Dashboard
    │
    ├── KPI Cards ──────────────────────► Analytics (lien direct)
    │
    ├── Recent Tools
    │       ├── [View]  ──────────────► ToolsDetail (sidebar)
    │       ├── [Edit]  ──────────────► ToolsModal (modal)
    │       └── [Delete] ─────────────► Confirmation + suppression
    │
    └── Header Search ────────────────► Filtre temps réel cross-page

Tools Catalog
    │
    ├── Sidebar Filters ─────────────► Filtre statut / département / catégorie / coût
    ├── Table Actions ───────────────► View / Edit / Delete / Toggle
    ├── Bulk Select ─────────────────► Suppression multiple
    └── URL Params ──────────────────► /tools?status=unused (depuis Analytics)

Analytics
    │
    ├── Time Range 30j/90j/1an ──────► Filtre les charts et outils
    ├── Department Filter ───────────► Filtre les sections Department Activity
    ├── Search Bar ──────────────────► Filtre les outils dans toutes les sections
    └── Navigation Rapide
            ├── "Voir outils inutilisés" ──► /tools?status=unused
            └── "Voir tous les outils"  ──► /tools
```

### Comportements de navigation notables

- **Search globale** dans le Header (desktop) — propagée via props à chaque page
- **Sticky MobilePageHeader** — titre + search flottants au scroll sur mobile
- **Query params** — `/tools?status=unused` pré-applique le filtre à l'arrivée
- **Reset search** — la search se vide automatiquement au changement de route

---

## 📊 Data Integration Strategy

### Architecture de données

```
JSON Server API
      │
      ▼
src/utils/api.js          ← fonctions Axios (getTools, createTool, updateTool...)
      │
      ▼
src/hooks/useTools.js     ← hooks TanStack Query (cache, invalidation, mutations)
      │
      ▼
Pages & Composants        ← consomment les hooks, pas l'API directement
```

### Hooks disponibles

| Hook | Type | Description |
|---|---|---|
| `useRecentTools` | Query | 5 outils les plus récents |
| `useAllTools` | Query | Catalogue complet (25+ outils) |
| `useAnalytics` | Query | KPIs, budget, trends |
| `useDepartments` | Query | Liste des départements |
| `useCreateTool` | Mutation | Création + invalidation cache |
| `useUpdateTool` | Mutation | Modification + invalidation cache |
| `useDeleteTool` | Mutation | Suppression + invalidation cache |

### Stratégie de cache TanStack Query

- **staleTime** : données considérées fraîches pendant 30s
- **Invalidation automatique** après chaque mutation (create/update/delete)
- **Skeleton loading** sur chaque page pendant le premier fetch
- **ErrorState** avec bouton retry si le serveur est inaccessible

---

## 📱 Progressive Responsive Design

### Approche mobile-first par page

**Header**
- Desktop : logo + nav links + search bar + toggle dark mode
- Mobile : logo + hamburger menu (nav links uniquement)
- Search déplacée dans chaque page sur mobile

**Dashboard**
- Desktop : grid 4 colonnes KPI + tableau avec toutes les colonnes
- Mobile : grid 2 colonnes KPI + cards empilées + tri via Select natif

**Tools Catalog**
- Desktop : sidebar filtres (fixed left) + tableau complet
- Mobile : drawer filtres (overlay) + cards empilées + search bar visible

**Analytics**
- Desktop : grid 4 colonnes KPI + charts côte à côte
- Mobile : KPIs empilés + charts pleine largeur + sections stackées

**MobilePageHeader (sticky)**
- Invisible en haut de page
- Apparaît au scroll avec titre + search condensés
- `backdrop-blur` + border subtile pour lisibilité

---

## 🧪 Testing Strategy

### Couverture — 99 tests / 10 fichiers

```bash
npm run test -- --run
```

| Fichier | Tests | Scope |
|---|---|---|
| `helpers.test.js` | 25 | formatCurrency, formatDate, formatPercent, sortItems, filterBySearch, getDaysFromTimeRange |
| `Analytics.test.jsx` | 13 | InsightKPI, AlertCard — props, variants, liens |
| `Dashboard.test.jsx` | 12 | KPICards, RecentTools — rendu, données, skeleton |
| `Tools.test.jsx` | 13 | ToolsTable, ToolsFilters — rendu, interactions, filtres |
| `Button.test.jsx` | 8 | Variants, disabled, onClick, className |
| `Badge.test.jsx` | 7 | Variants, labels, children |
| `ErrorState.test.jsx` | 6 | Rendu, message, bouton retry |
| `Input.test.jsx` | 6 | Placeholder, value, onChange, icône, type |
| `KPICards.test.jsx` | 5 | Labels, valeurs, skeleton |
| `StatusBadge.test.jsx` | 4 | Variants de statut |

### Principes de test appliqués

- **Testing Library** — tests centrés sur le comportement utilisateur, pas l'implémentation
- **getAllByText** plutôt que **getByText** pour les composants responsive (mobile + desktop rendus simultanément)
- **Mocks vi.fn()** pour les callbacks (onEdit, onDelete, onView)
- **MemoryRouter + QueryClientProvider** comme wrapper standard pour tous les tests

---

## ⚡ Performance Optimizations

### Memoïsation

- **`useMemo`** sur tous les filtres — `filteredTools` ne recalcule que si les dépendances changent
- **`effectiveFilters`** — combine URL params + sidebar filters sans re-render inutile
- **`useCallback`** sur les handlers dans les composants lourds (ToolsTable)

### Rendering

- **Skeleton loading** sur les 3 pages — évite les layout shifts au chargement
- **Pagination** 10 items/page sur Tools — évite de rendre 25+ lignes simultanément
- **Composants statiques hors render** — `SkeletonBox` déclaré en dehors des composants pour éviter les re-créations

### Data fetching

- **TanStack Query cache** — pas de re-fetch si données encore fraîches
- **Invalidation ciblée** — seule la query `tools` est invalidée après une mutation, pas `analytics`
- **Parallel queries** — `useAllTools` et `useDepartments` fetchés en parallèle sur Tools

---

## 🎯 Design Consistency Approach

Sans mockups pour les Jours 7-8, la cohérence a été maintenue grâce à :

### Tokens centralisés

```js
// constants.js
export const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e']
export const STATUS_COLORS = { active: '...emerald...', expiring: '...orange...', unused: '...red...' }
```

### Patterns réutilisés

- **Card pattern** : `rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black`
- **Section header** : titre `font-semibold` + sous-titre `text-sm text-gray-500`
- **Empty state** : icône centrée + texte + sous-texte gris
- **Toast notifications** : position `fixed bottom-6 right-6`, emerald/red, 3s auto-dismiss

### Règles de cohérence

- Toujours `rounded-xl` pour les conteneurs, `rounded-lg` pour les éléments internes
- Toujours `gap-6` entre les sections majeures, `gap-4` entre les cards
- Toujours `px-3 sm:px-6 py-8` comme padding de page
- Toujours `text-2xl font-bold` pour les titres de page

---

## 📈 Data Visualization Philosophy

### Choix de Recharts

Recharts a été choisi pour son intégration naturelle avec React (composants déclaratifs), sa compatibilité avec le dark mode via des props de couleur, et sa flexibilité pour les `CustomTooltip`.

### Intégration au design system

- **Couleurs** : `CHART_COLORS` depuis `constants.js` — violet, cyan, emerald, amber, rose
- **Tooltips custom** : fond `bg-gray-900` + border `border-white/10` pour cohérence dark mode
- **`ResponsiveContainer`** : tous les charts sont 100% width, hauteur fixe
- **Animations** : désactivées (`isAnimationActive={false}`) pour éviter les glitches au re-render

### Charts par page

| Chart | Type | Données |
|---|---|---|
| `SpendLineChart` | AreaChart + gradient | budget_overview — évolution sur 1/3/12 mois |
| `DepartmentPieChart` | PieChart donut | Répartition coût par département |
| `TopToolsBarChart` | BarChart horizontal | Top 8 outils triés par monthly_cost |

---

## 🔮 Next Steps / Complete App Vision

### Fonctionnalités prioritaires

- **Authentification** — login/logout, rôles (admin, viewer, manager)
- **Notifications** — alertes budget, renouvellements à venir, outils inutilisés
- **Export** — CSV/PDF des outils et rapports analytics
- **Contrats & renouvellements** — dates d'expiration, rappels automatiques
- **Intégrations** — import depuis G Suite, Okta, Azure AD

### Améliorations techniques

- **Tests E2E** — Playwright ou Cypress pour les flows CRUD complets
- **Internationalisation** — i18n pour support multilingue
- **Accessibilité** — audit WCAG 2.1 complet, focus management dans les modals
- **PWA** — service worker pour mode hors-ligne
- **Storybook** — documentation interactive du design system

### Évolutions Analytics

- **Forecasting** — projection budget sur 6/12 mois
- **Comparaison périodes** — N vs N-1 sur tous les KPIs
- **Alertes configurables** — seuils personnalisables par utilisateur
- **Drill-down** — clic sur un département → détail des outils de ce département

### Vision produit

TechCorp Dashboard a vocation à devenir la **source de vérité unique** pour la gestion des outils SaaS d'une organisation — de la discovery à l'optimisation des coûts, en passant par la gouvernance des accès et le suivi de la valeur métier de chaque outil.
