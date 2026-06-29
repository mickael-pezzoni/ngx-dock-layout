---
name: check-app
description: Vérifie l'application complète — TypeScript, ESLint, tests unitaires, conventions de nommage (BEM ndl-, sélecteurs Angular). Utilise après un changement de type/modèle pour détecter les incohérences.
---

Lance tous les checks statiques sur le projet ngx-dock-layout via le driver `.claude/skills/check-app/smoke.sh`. Couvre : build lib, TypeScript workspace-wide, ESLint, tests unitaires Vitest, conventions de nommage.

## Run

```bash
bash .claude/skills/check-app/smoke.sh
```

Sortie typique (avec erreurs réelles détectées) :

```
── Library build (ng-packagr) ──
  ✔ Library builds clean

── TypeScript (tsc --noEmit) ──
  ✘ TypeScript errors:
layout.utils.spec.ts(22,7): error TS2741: Property 'isEditable' is missing ...

── ESLint ──
  ✔ ESLint clean

── Unit tests (vitest) ──
  ✔ Unit tests: 102 passed

── Naming conventions ──
  ✔ All lib selectors use ndl- prefix
  ✔ SCSS class names follow ndl- BEM convention

1 check(s) failed.
```

## Ce que chaque check couvre

| Check | Ce qu'il attrape |
|---|---|
| **Library build** (`ng build ngx-dock-layout`) | Erreurs de template Angular, erreurs TS dans le code lib |
| **TypeScript** (`tsc --noEmit`) | Erreurs TS dans tout le workspace — y compris les fichiers de test (que `ng build` ignore) |
| **ESLint** (`npm run lint`) | Style de code, imports inutilisés, règles Angular |
| **Unit tests** (`npm run test:unit`) | Régressions fonctionnelles (vitest, sans type-checking) |
| **Naming conventions** (grep) | Sélecteurs Angular sans préfixe `ndl-`, classes CSS SCSS sans préfixe `ndl-` |

## Gotchas

- **`tsc --noEmit` et vitest sont indépendants** : les tests peuvent passer à 100% (vitest ne fait pas de type-checking) alors que tsc détecte des erreurs TS réelles. Toujours vérifier les deux.
- **Après l'ajout d'un champ obligatoire dans un type strict** (`StrictTab`, etc.), les fixtures de test ne sont pas mises à jour automatiquement — `tsc --noEmit` les détectera, vitest non.
- **Le build lib ne couvre pas les specs** : `ng build ngx-packagr` ne compile que `src/public-api.ts` et ses imports — les fichiers `.spec.ts` sont exclus. C'est pour ça que le check TypeScript workspace est nécessaire en plus.
