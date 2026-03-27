# Calculatrice Scientifique Pro

## Concept & Vision

Une calculatrice scientifique de qualité professionnelle inspirée des calculatrices HP/TI haut de gamme. Design matériel premium avec écran LCD rétroéclairé, touches ergonomiques avec feedback visuel, et fonctionnalités scientifiques complètes. L'interface évoque la précision et la fiabilité d'un instrument de travail sérieux.

## Design Language

### Aesthetic Direction
Style "Hardware Premium" - imitation boîtier métallique satiné, écran LCD avec effet de profondeur, touches en plastique texturé avec ombres subtiles.palette-

### Colors
- **Primary**: `#1a1a2e` (boîtier sombre)
- **Secondary**: `#16213e` (éclairage fond)
- **Accent**: `#e94560` (touches spéciales)
- **Screen BG**: `#c5c6a6` (LCD vert-jaune)
- **Screen Text**: `#1a2820` (pixels LCD)
- **Button Base**: `#2d2d44` (touches numériques)
- **Button Ops**: `#e94560` (opérations)
- **Button Sci**: `#0f3460` (fonctions scientifiques)
- **Text Light**: `#eaeaea`

### Typography
- **Display**: `'VT323', monospace` (écran LCD)
- **Buttons**: `'IBM Plex Sans', sans-serif` (labels touches)
- **Title**: `'Orbitron', sans-serif` (logo)

### Motion Philosophy
- Press button: scale 0.95 + shadow reduction (50ms)
- Release: bounce back avec easing (150ms)
- Mode switch: crossfade (200ms)
- Result display: slide-in depuis droite (300ms)

## Layout & Structure

```
┌─────────────────────────────────────┐
│  ═══ SCIENTIFIC CALCULATOR ═══      │
│  ┌───────────────────────────────┐  │
│  │  MODE: DEG  │  2nd │  HYP    │  │
│  │                               │  │
│  │          1234567890           │  │
│  │          ──────────           │  │
│  │         result here           │  │
│  └───────────────────────────────┘  │
│                                     │
│  [2nd] [hyp] [sin] [cos] [tan] [^]  │
│  [sin⁻¹][cos⁻¹][tan⁻¹][√][³√][log] │
│  [ ln ] [10^x] [π]  [ e ]  [ n!]   │
│  [ ( ]  [ ) ]   [%]  [CE]  [AC]    │
│                                     │
│  [ 7 ]  [ 8 ]  [ 9 ]  [ ÷ ] [π]    │
│  [ 4 ]  [ 5 ]  [ 6 ]  [ × ] [EE]   │
│  [ 1 ]  [ 2 ]  [ 3 ]  [ - ] [ANS]  │
│  [ 0 ]  [ . ]  [±]   [ + ]  [=]   │
│                                     │
│  ════════════════════════════════   │
└─────────────────────────────────────┘
```

### Responsive Strategy
- Desktop: 480px max-width centré
- Mobile: full-width avec touches agrandies
- Breakpoint: 500px

## Features & Interactions

### Core Features
1. **Opérations basiques**: +, -, ×, ÷, %, ±
2. **Fonctions scientifiques**: sin, cos, tan, sin⁻¹, cos⁻¹, tan⁻¹
3. **Logarithmes**: ln, log, 10^x
4. **Puissances**: x^y, √x, ³√x, x²
5. **Constantes**: π (3.14159265359), e (2.71828182846)
6. **Factorielle**: n!
7. **Mémoire**: MC, MR, M+, M-
8. **Notation**: EE (notation scientifique), ANS (dernier résultat)
9. **Modes**: DEG/RAD, 2nd (secondary functions), HYP (hyperbolique)

### Interaction Details
- **Click**: scale(0.95) + changement couleur, son click optionnel
- **Hover**: glow subtil
- **Long press** (touches numériques): active répétition
- **Erreur**: affichage "Error" + vibration visuelle
- **Overflow**: notation scientifique automatique

### Edge Cases
- Division par zéro: affiche "Error"
- Nombre trop grand: bascule en notation scientifique
- Parenthèses non fermées: compensation automatique
- Opération invalide: feedback visuel rouge

## Component Inventory

### Display
- Écran LCD avec effet "groove"
- Indicateurs de mode (DEG/RAD, 2nd, HYP)
- Ligne d'entrée + ligne de résultat
- Étiquettes: `INPUT:` et `RESULT:`

### Buttons
- **Number buttons**: fond sombre, texte clair
- **Operation buttons**: fond rouge accent
- **Scientific buttons**: fond bleu foncé
- **Mode buttons**: fond vert/ambre
- **States**: default, hover (glow), active (pressed), disabled (grayed)

### Keyboard Support
- Toutes les touches accessibles au clavier
- Enter = égal, Escape = clear
- Backspace = effacer dernier caractère

## Technical Approach

### Architecture
- Single HTML file avec CSS et JS embarqués
- Parser mathématique sécurisé (pas d'eval)
- Expression tokenizer → evaluator pattern
- Gestion d'état avec objet CalculatorState

### Security
- Échappement des entrées utilisateur
- Parser mathématique maison (pas eval/Function)
- Validation des expressions avant calcul
- CSP-ready (pas de strings inline)
- Rate limiting sur les calculs (anti-hammering)

### State Management
```javascript
{
  expression: "",
  result: "0",
  memory: 0,
  isRadian: false,
  isSecondFunc: false,
  isHyperbolic: false,
  hasError: false,
  lastAnswer: null
}
```
