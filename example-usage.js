/**
 * Exemple d'utilisation du UnityWebGLLoader
 * Ce fichier montre différentes façons d'utiliser le loader Unity WebGL
 */

// ==================== USAGE SIMPLE ====================

// 1. Usage basique - charge avec les paramètres par défaut
function loadUnityBasic() {
    const unityLoader = new UnityWebGLLoader();
    unityLoader.load();
}

// ==================== USAGE AVANCÉ ====================

// 2. Usage avec configuration personnalisée
function loadUnityAdvanced() {
    const unityLoader = new UnityWebGLLoader({
        buildUrl: "Build",                    // Dossier contenant les fichiers Unity
        canvasId: "unity-canvas",            // ID du canvas Unity
        containerId: "unity-container",       // ID du conteneur Unity
        companyName: "VotreCompany",         // Nom de votre compagnie
        productName: "MonJeuAR",             // Nom de votre jeu
        productVersion: "2.0.0",             // Version
        canvasWidth: 1200,                   // Largeur canvas desktop
        canvasHeight: 800,                   // Hauteur canvas desktop
        autoSyncPersistentData: true,        // Sauvegarde automatique
        showBanner: true                     // Affichage des messages
    });

    unityLoader.load();
    
    // Stocker la référence globalement pour interactions futures
    window.unityGame = unityLoader;
}

// ==================== ÉVÉNEMENTS PERSONNALISÉS ====================

// 3. Écouter les événements Unity
function setupUnityEvents() {
    // Événement de progression
    document.addEventListener('unity-progress', (event) => {
        const { progress, percentage } = event.detail;
        console.log(`Chargement: ${percentage}%`);
        
        // Vous pouvez ici mettre à jour votre propre UI de progression
        updateCustomProgressBar(percentage);
    });

    // Événement de chargement terminé
    document.addEventListener('unity-loaded', (event) => {
        const { unityInstance } = event.detail;
        console.log("🎮 Unity prêt!");
        
        // Votre logique quand Unity est chargé
        onUnityReady(unityInstance);
    });

    // Événement d'erreur
    document.addEventListener('unity-error', (event) => {
        const { error } = event.detail;
        console.error("Erreur Unity:", error);
        
        // Gestion d'erreur personnalisée
        showErrorMessage(error.message);
    });
}

// ==================== FONCTIONS D'EXEMPLE ====================

// Fonction appelée quand Unity est prêt
function onUnityReady(unityInstance) {
    console.log("✅ Unity WebGL chargé!");
    
    // Exemple: envoyer des données à Unity
    setTimeout(() => {
        // unityInstance.SendMessage("GameManager", "SetPlayerName", "Joueur1");
        // unityInstance.SendMessage("UI", "ShowWelcomeMessage", "Bienvenue!");
    }, 1000);
    
    // Exemple: ajouter des contrôles personnalisés
    addCustomControls(unityInstance);
}

// Fonction pour ajouter des contrôles personnalisés
function addCustomControls(unityInstance) {
    // Bouton pour mettre en pause
    const pauseButton = document.createElement('button');
    pauseButton.textContent = '⏸️ Pause';
    pauseButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1000;
        padding: 10px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    
    let isPaused = false;
    pauseButton.onclick = () => {
        isPaused = !isPaused;
        window.unityGame.setPaused(isPaused);
        pauseButton.textContent = isPaused ? '▶️ Play' : '⏸️ Pause';
    };
    
    document.body.appendChild(pauseButton);
    
    // Bouton pour envoyer un message à Unity
    const messageButton = document.createElement('button');
    messageButton.textContent = '📩 Message';
    messageButton.style.cssText = `
        position: absolute;
        top: 60px;
        right: 10px;
        z-index: 1000;
        padding: 10px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    
    messageButton.onclick = () => {
        // Exemple d'envoi de message à Unity
        window.unityGame.sendMessage("GameManager", "OnWebMessage", "Hello from Web!");
        window.unityGame.showBanner("Message envoyé à Unity!", "success");
    };
    
    document.body.appendChild(messageButton);
}

// Mise à jour d'une barre de progression personnalisée
function updateCustomProgressBar(percentage) {
    // Exemple si vous avez votre propre barre de progression
    const customProgressBar = document.querySelector('#custom-progress');
    if (customProgressBar) {
        customProgressBar.style.width = percentage + '%';
        customProgressBar.textContent = percentage + '%';
    }
}

// Affichage d'erreur personnalisé
function showErrorMessage(message) {
    // Créer une popup d'erreur personnalisée
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        ">
            <h3>🚫 Erreur Unity WebGL</h3>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: white; color: #ff4444; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Fermer
            </button>
        </div>
    `;
    document.body.appendChild(errorDiv);
}

// ==================== INITIALISATION ====================

// Fonction principale d'initialisation
function initUnityGame() {
    console.log("🚀 Initialisation du jeu Unity WebGL");
    
    // Configuration des événements
    setupUnityEvents();
    
    // Chargement avec configuration avancée
    loadUnityAdvanced();
}

// ==================== FONCTIONS UTILITAIRES ====================

// Vérifier si Unity est supporté
function isUnitySupported() {
    // Vérification basique du support WebGL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        console.warn("WebGL non supporté");
        return false;
    }
    
    // Vérification du support WASM
    if (typeof WebAssembly === 'undefined') {
        console.warn("WebAssembly non supporté");
        return false;
    }
    
    return true;
}

// Afficher des informations sur Unity
function showUnityInfo() {
    if (window.unityGame) {
        const info = window.unityGame.getInfo();
        console.table(info);
        return info;
    }
    return null;
}

// ==================== AUTO-INITIALISATION ====================

// Auto-initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    console.log("📄 DOM prêt");
    
    // Vérifier le support
    if (!isUnitySupported()) {
        showErrorMessage("Votre navigateur ne supporte pas Unity WebGL. Veuillez utiliser un navigateur moderne.");
        return;
    }
    
    // Attendre un petit délai puis initialiser
    setTimeout(initUnityGame, 500);
});

// ==================== EXPORT POUR USAGE EXTERNE ====================

// Exporter les fonctions utiles
window.UnityGameUtils = {
    load: initUnityGame,
    loadBasic: loadUnityBasic,
    loadAdvanced: loadUnityAdvanced,
    showInfo: showUnityInfo,
    isSupported: isUnitySupported
}; 