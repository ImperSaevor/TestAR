# 🎮 Unity WebGL Loader - Guide d'utilisation

Ce projet contient un loader JavaScript modulaire et avancé pour vos builds Unity WebGL.

## 📁 Fichiers créés

- **`unity-loader.js`** - Loader principal (classe UnityWebGLLoader)
- **`example-usage.js`** - Exemples d'utilisation détaillés
- **`index-simple.html`** - Page HTML utilisant le nouveau loader
- **`index.html`** - Votre page originale Unity (préservée)

## 🚀 Utilisation rapide

### Option 1: Utilisation simple

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mon jeu Unity</title>
    <!-- Vos autres includes CSS/meta -->
</head>
<body>
    <!-- Votre HTML avec canvas #unity-canvas -->
    
    <script src="unity-loader.js"></script>
    <script>
        const unityLoader = new UnityWebGLLoader();
        unityLoader.load();
    </script>
</body>
</html>
```

### Option 2: Configuration personnalisée

```javascript
const unityLoader = new UnityWebGLLoader({
    buildUrl: "Build",                    // Dossier des fichiers Unity
    canvasId: "unity-canvas",            // ID du canvas
    companyName: "VotreCompany",         // Votre compagnie
    productName: "MonJeuAR",             // Nom du jeu
    canvasWidth: 1200,                   // Largeur desktop
    canvasHeight: 800,                   // Hauteur desktop
    autoSyncPersistentData: true,        // Sauvegarde auto
    showBanner: true                     // Messages d'état
});

unityLoader.load();
```

## 🔧 Fonctionnalités

### ✅ **Chargement intelligent**
- Détection automatique mobile/desktop
- Barre de progression stylée
- Gestion d'erreurs robuste
- Support Git LFS (fichiers volumineux)

### ✅ **Contrôles avancés**
- Plein écran automatique
- Pause/Resume
- Envoi de messages à Unity
- Raccourcis clavier (F11, Escape, Ctrl+R)

### ✅ **Événements personnalisés**
```javascript
// Écouter la progression
document.addEventListener('unity-progress', (event) => {
    console.log(`Chargement: ${event.detail.percentage}%`);
});

// Écouter le chargement terminé
document.addEventListener('unity-loaded', (event) => {
    console.log("Unity prêt!", event.detail.unityInstance);
});

// Écouter les erreurs
document.addEventListener('unity-error', (event) => {
    console.error("Erreur:", event.detail.error);
});
```

### ✅ **Méthodes utiles**
```javascript
// Envoyer un message à Unity
unityLoader.sendMessage("GameManager", "SetPlayerName", "Joueur1");

// Pause/Resume
unityLoader.setPaused(true);  // Pause
unityLoader.setPaused(false); // Resume

// Plein écran
unityLoader.toggleFullscreen();

// Afficher un message
unityLoader.showBanner("Message important!", "warning");

// Informations
const info = unityLoader.getInfo();
console.log(info.isLoaded, info.config);
```

## 📱 Support mobile

Le loader détecte automatiquement les appareils mobiles et :
- Ajuste la taille du canvas
- Configure le viewport approprié
- Applique les classes CSS mobiles
- Optimise les performances

## 🎨 Personnalisation CSS

Les fichiers utilisent les IDs Unity standard :
- `#unity-container` - Conteneur principal
- `#unity-canvas` - Canvas Unity
- `#unity-loading-bar` - Barre de chargement
- `#unity-progress-bar-full` - Barre de progression
- `#unity-warning` - Zone de messages
- `#unity-fullscreen-button` - Bouton plein écran

Vous pouvez personnaliser l'apparence en modifiant votre CSS.

## 🛠️ Développement avancé

### Communication avec Unity

```csharp
// Dans Unity (C#)
public void OnWebMessage(string message) {
    Debug.Log("Message reçu du web: " + message);
}

public void SetQuality(int level) {
    QualitySettings.SetQualityLevel(level);
}
```

```javascript
// Depuis JavaScript
unityLoader.sendMessage("GameManager", "OnWebMessage", "Hello Unity!");
unityLoader.sendMessage("QualityManager", "SetQuality", "2");
```

### Gestion des erreurs

```javascript
document.addEventListener('unity-error', (event) => {
    const error = event.detail.error;
    
    // Log détaillé
    console.error("Erreur Unity WebGL:", error);
    
    // Interface utilisateur
    showCustomErrorDialog(error.message);
    
    // Analytics (optionnel)
    trackError('unity-webgl-error', error);
});
```

## 📊 Avantages vs version originale

| Fonctionnalité | Version originale | Notre loader |
|---|---|---|
| **Code modulaire** | ❌ Intégré dans HTML | ✅ Classe séparée |
| **Réutilisabilité** | ❌ Copy-paste | ✅ Import simple |
| **Événements custom** | ❌ Non | ✅ Oui |
| **API simplifiée** | ❌ Code complexe | ✅ Méthodes claires |
| **Gestion d'erreurs** | ⚠️ Basique | ✅ Avancée |
| **Support mobile** | ✅ Oui | ✅ Amélioré |
| **Personnalisation** | ⚠️ Limitée | ✅ Flexible |

## 🔄 Migration depuis l'ancien index.html

1. **Sauvegarder** votre `index.html` actuel
2. **Copier** `unity-loader.js` dans votre projet  
3. **Utiliser** `index-simple.html` comme base
4. **Adapter** selon vos besoins spécifiques

## 🐛 Débogage

### Console JavaScript
```javascript
// Informations Unity
console.log(window.unityGame.getInfo());

// Forcer un rechargement
window.unityGame.load();

// Tester la communication
window.unityGame.sendMessage("TestObject", "TestMethod", "test");
```

### Vérifications courantes
- ✅ Fichiers Build/* accessibles
- ✅ Canvas avec bon ID présent
- ✅ Pas d'erreurs CORS
- ✅ WebGL supporté par le navigateur

## 🚀 Performance

### Optimisations intégrées
- Chargement asynchrone des scripts
- Gestion automatique mobile/desktop
- Pause automatique si onglet caché
- Nettoyage mémoire approprié

### Conseils supplémentaires
- Utilisez un serveur web (pas file://)
- Activez la compression GZIP
- Utilisez Git LFS pour gros fichiers
- Testez sur différents navigateurs

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez la console** (F12) pour les erreurs
2. **Testez** avec `index-simple.html` d'abord  
3. **Consultez** `example-usage.js` pour des exemples
4. **Adaptez** la configuration selon vos besoins

## 📜 Licence

Ce code est fourni à des fins éducatives et de développement. Adaptez-le selon vos besoins de projet.

---

**Créé avec ❤️ pour Unity WebGL**

*Version: 1.0.0* 