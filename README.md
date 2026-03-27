# ScientifIC Pro - Calculatrice Scientifique

![Version](https://img.shields.io/badge/version-1.0.0--blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-CSS3-orange?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge)

> Une calculatrice scientifique professionnelle inspirée des calculatrices HP/TI haut de gamme. Design matériel premium avec écran LCD, touches ergonomiques et fonctionnalités scientifiques complètes.

## ✨ Fonctionnalités

### Opérations de Base
| Opération | Description |
|-----------|-------------|
| `+` `−` `×` `÷` | Addition, soustraction, multiplication, division |
| `%` | Pourcentage |
| `±` | Changement de signe |
| `ANS` | Dernier résultat |

### Fonctions Scientifiques
| Fonction | Description |
|----------|-------------|
| `sin` `cos` `tan` | Sinus, cosinus, tangente |
| `sin⁻¹` `cos⁻¹` `tan⁻¹` | Fonctions trigonométriques inverses |
| `ln` | Logarithme népérien |
| `log` | Logarithme décimal (base 10) |
| `10ˣ` | Exponentielle (10 puissance x) |
| `eˣ` | Fonction exponentielle |

### Fonctions Avancées
| Fonction | Description |
|----------|-------------|
| `x²` | Carré |
| `xʸ` | Puissance (x puissance y) |
| `√` | Racine carrée |
| `³√` | Racine cubique |
| `n!` | Factorielle |
| `π` | Constante Pi (3.14159265359) |
| `e` | Constante d'Euler (2.71828182846) |

### Fonctions Hyperboliques (mode HYP)
| Fonction | Description |
|----------|-------------|
| `sinh` `cosh` `tanh` | Sinus, cosinus, tangente hyperboliques |
| `sinh⁻¹` `cosh⁻¹` `tanh⁻¹` | Fonctions hyperboliques inverses |

### Gestion de la Mémoire
| Bouton | Description |
|--------|-------------|
| `MS` | Stocker en mémoire |
| `MR` | Rappel mémoire |
| `M+` | Ajouter à la mémoire |
| `M−` | Soustraire de la mémoire |

### Modes de Calcul
| Mode | Description |
|------|-------------|
| `DEG` | Mode degrés (par défaut) |
| `RAD` | Mode radians |
| `2nd` | Fonctions secondaires (inverses) |
| `HYP` | Fonctions hyperboliques |

## ⌨️ Raccourcis Clavier

| Touche | Action |
|--------|--------|
| `0` - `9` | Chiffres |
| `.` | Virgule décimale |
| `+` `-` `*` `/` | Opérateurs |
| `Enter` | Calculer |
| `Escape` | Tout effacer (AC) |
| `Backspace` | Effacer dernier caractère |
| `%` | Pourcentage |
| `(` `)` | Parenthèses |

## 🎨 Design

### Palette de Couleurs

```
Boîtier principal    #1a1a2e    ██████████
Écran LCD           #c5c6a6    ██████████
Accent (opérations)  #e94560    ██████████
Touches numériques  #2d2d44    ██████████
Touches scientifiques #0f3460  ██████████
```

### Typographie
- **Logo** : Orbitron (Google Fonts)
- **Écran LCD** : VT323 (Google Fonts)
- **Labels boutons** : IBM Plex Sans (Google Fonts)

## 🔒 Sécurité

Cette calculatrice implémente plusieurs couches de protection :

1. **Parser mathématiques sécurisé** - N'utilise pas `eval()` ni `Function()`. Un parser tokenisé personnalisé évalue les expressions en toute sécurité.

2. **Rate limiting** - Limitation du nombre de calculs pour prévenir les attaques par épuisement des ressources.

3. **Échappement XSS** - Toutes les entrées sont sanitizées avant affichage.

4. **Isolation du scope** - Le code JavaScript s'exécute dans un IIFE (Immediately Invoked Function Expression) isolé.

5. **Validation des entrées** - Les expressions sont validées avant évaluation.

## 📱 Responsive Design

| Support | Comportement |
|---------|--------------|
| Desktop (>500px) | Calculatrice centrée, 480px max-width |
| Tablette (380-500px) | Grille 4 colonnes pour touches scientifiques |
| Mobile (<380px) | Grille adaptée 4 colonnes, touches agrandies |

## 🚀 Utilisation

1. Clonez ou téléchargez le projet
2. Ouvrez `index.html` dans n'importe quel navigateur moderne
3. Commencez à calculer !

```bash
# Clone du dépôt
git clone https://github.com/aerab243/calculatrice.git

# Ou，直接 dans le navigateur
# Ouvrez le fichier index.html
```

## 🧪 Tests

Le parser mathématique gère correctement :

- [x] Opérations arithmétiques de base
- [x] Priorité des opérateurs (PEMDAS)
- [x] Parenthèses imbriquées
- [x] Division par zéro → `Error`
- [x] Overflow → notation scientifique
- [x] Factorielle de nombres positifs
- [x] Fonctions trigonométriques en degrés et radians
- [x] Logarithmes et exponentielles
- [x] Puissances et racines

## 📁 Structure du Projet

```
calculatrice/
├── index.html         # Page principale
├── css/
│   └── style.css     # Styles de la calculatrice
├── js/
│   └── calculator.js # Logique applicative
├── assets/           # Ressources (images, icônes)
├── SPEC.md           # Spécification technique détaillée
├── LICENSE           # Licence MIT
└── README.md         # Ce fichier
```

## 🛠️ Technologies

- **HTML5** - Structure sémantique
- **CSS3** - Styles avancés (Flexbox, Grid, Custom Properties, Animations)
- **JavaScript ES6+** - Logique applicative
- **Google Fonts** - Typographie (Orbitron, VT323, IBM Plex Sans)

## 📄 Licence

MIT License - voir fichier [LICENSE](./LICENSE)

---

Développé avec ❤️ par [aerab243](https://github.com/aerab243)

*Dernière mise à jour : Mars 2026*
