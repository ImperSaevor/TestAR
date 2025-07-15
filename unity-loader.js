/**
 * Unity WebGL Loader
 * Fichier JavaScript pour charger et gérer un build Unity WebGL
 * Auteur: Assistant IA
 */

class UnityWebGLLoader {
    constructor(options = {}) {
        // Configuration par défaut
        this.config = {
            buildUrl: options.buildUrl || "Build",
            canvasId: options.canvasId || "unity-canvas",
            containerId: options.containerId || "unity-container",
            progressBarId: options.progressBarId || "unity-progress-bar-full",
            loadingBarId: options.loadingBarId || "unity-loading-bar",
            fullscreenButtonId: options.fullscreenButtonId || "unity-fullscreen-button",
            warningId: options.warningId || "unity-warning",
            companyName: options.companyName || "DefaultCompany",
            productName: options.productName || "Project VisitedAugm",
            productVersion: options.productVersion || "1.0.0",
            canvasWidth: options.canvasWidth || 960,
            canvasHeight: options.canvasHeight || 600,
            showBanner: options.showBanner !== false,
            autoSyncPersistentData: options.autoSyncPersistentData || false
        };

        this.unityInstance = null;
        this.isLoading = false;
        this.canvas = null;
        
        // Bind des méthodes
        this.load = this.load.bind(this);
        this.showBanner = this.showBanner.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onLoaded = this.onLoaded.bind(this);
        this.onError = this.onError.bind(this);
    }

    /**
     * Initialise et charge Unity WebGL
     */
    async load() {
        if (this.isLoading) {
            console.warn("Unity is already loading...");
            return;
        }

        try {
            this.isLoading = true;
            
            // Récupération des éléments DOM
            this.canvas = document.querySelector(`#${this.config.canvasId}`);
            if (!this.canvas) {
                throw new Error(`Canvas avec l'ID '${this.config.canvasId}' non trouvé`);
            }

            // Configuration Unity
            const unityConfig = {
                arguments: [],
                dataUrl: `${this.config.buildUrl}/Build Web.data`,
                frameworkUrl: `${this.config.buildUrl}/Build Web.framework.js`,
                codeUrl: `${this.config.buildUrl}/Build Web.wasm`,
                streamingAssetsUrl: "StreamingAssets",
                companyName: this.config.companyName,
                productName: this.config.productName,
                productVersion: this.config.productVersion,
                showBanner: this.config.showBanner ? this.showBanner : undefined,
            };

            // Configuration pour la persistence des données
            if (this.config.autoSyncPersistentData) {
                unityConfig.autoSyncPersistentDataPath = true;
            }

            // Détection mobile et ajustement du style
            this.setupCanvasStyle();

            // Affichage de la barre de chargement
            this.showLoadingBar(true);

            // Chargement du loader Unity
            const loaderUrl = `${this.config.buildUrl}/Build Web.loader.js`;
            await this.loadScript(loaderUrl);

            // Création de l'instance Unity
            console.log("🎮 Démarrage de Unity WebGL...");
            this.unityInstance = await createUnityInstance(
                this.canvas, 
                unityConfig, 
                this.onProgress
            );

            this.onLoaded();

        } catch (error) {
            this.onError(error);
        }
    }

    /**
     * Configure le style du canvas selon le device
     */
    setupCanvasStyle() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            console.log("📱 Device mobile détecté");
            
            // Ajout du viewport meta tag pour mobile
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
            document.getElementsByTagName('head')[0].appendChild(meta);
            
            // Classes CSS pour mobile
            const container = document.querySelector(`#${this.config.containerId}`);
            if (container) container.className = "unity-mobile";
            this.canvas.className = "unity-mobile";
            
        } else {
            console.log("🖥️ Device desktop détecté");
            
            // Style desktop
            this.canvas.style.width = this.config.canvasWidth + "px";
            this.canvas.style.height = this.config.canvasHeight + "px";
        }
    }

    /**
     * Charge un script dynamiquement
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Impossible de charger ${src}`));
            document.body.appendChild(script);
        });
    }

    /**
     * Callback de progression du chargement
     */
    onProgress(progress) {
        const progressBar = document.querySelector(`#${this.config.progressBarId}`);
        if (progressBar) {
            progressBar.style.width = (100 * progress) + "%";
        }
        
        const percentage = Math.round(progress * 100);
        console.log(`📊 Chargement Unity: ${percentage}%`);
        
        // Événement personnalisé
        this.dispatchEvent('unity-progress', { progress, percentage });
    }

    /**
     * Callback quand Unity est chargé
     */
    onLoaded() {
        console.log("✅ Unity WebGL chargé avec succès!");
        this.isLoading = false;
        
        // Cacher la barre de chargement
        this.showLoadingBar(false);
        
        // Configuration du bouton plein écran
        this.setupFullscreenButton();
        
        // Événement personnalisé
        this.dispatchEvent('unity-loaded', { unityInstance: this.unityInstance });
    }

    /**
     * Callback d'erreur
     */
    onError(error) {
        console.error("❌ Erreur lors du chargement Unity:", error);
        this.isLoading = false;
        
        this.showBanner(
            `Erreur de chargement: ${error.message}`, 
            'error'
        );
        
        // Événement personnalisé
        this.dispatchEvent('unity-error', { error });
    }

    /**
     * Affiche ou cache la barre de chargement
     */
    showLoadingBar(show) {
        const loadingBar = document.querySelector(`#${this.config.loadingBarId}`);
        if (loadingBar) {
            loadingBar.style.display = show ? "block" : "none";
        }
    }

    /**
     * Configure le bouton plein écran
     */
    setupFullscreenButton() {
        const fullscreenButton = document.querySelector(`#${this.config.fullscreenButtonId}`);
        if (fullscreenButton && this.unityInstance) {
            fullscreenButton.onclick = this.toggleFullscreen;
        }
    }

    /**
     * Bascule en mode plein écran
     */
    toggleFullscreen() {
        if (this.unityInstance) {
            this.unityInstance.SetFullscreen(1);
            console.log("🔍 Mode plein écran activé");
        }
    }

    /**
     * Affiche un message banner/ribbon
     */
    showBanner(msg, type = 'info') {
        const warningBanner = document.querySelector(`#${this.config.warningId}`);
        if (!warningBanner) return;

        const div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);

        // Style selon le type
        switch(type) {
            case 'error':
                div.style = 'background: #ff4444; color: white; padding: 10px; margin: 5px 0; border-radius: 4px;';
                break;
            case 'warning':
                div.style = 'background: #ffaa00; color: white; padding: 10px; margin: 5px 0; border-radius: 4px;';
                break;
            case 'success':
                div.style = 'background: #44ff44; color: white; padding: 10px; margin: 5px 0; border-radius: 4px;';
                break;
            default:
                div.style = 'background: #4444ff; color: white; padding: 10px; margin: 5px 0; border-radius: 4px;';
        }

        // Auto-suppression après 5 secondes (sauf erreurs)
        if (type !== 'error') {
            setTimeout(() => {
                if (warningBanner.contains(div)) {
                    warningBanner.removeChild(div);
                }
                warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
            }, 5000);
        }

        warningBanner.style.display = 'block';
    }

    /**
     * Dispatch un événement personnalisé
     */
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Méthodes utilitaires pour interagir avec Unity
     */

    /**
     * Envoie un message à Unity
     */
    sendMessage(objectName, methodName, value = '') {
        if (this.unityInstance) {
            this.unityInstance.SendMessage(objectName, methodName, value);
        } else {
            console.warn("Unity instance non disponible");
        }
    }

    /**
     * Quitte Unity
     */
    quit() {
        if (this.unityInstance) {
            this.unityInstance.Quit();
            this.unityInstance = null;
            console.log("👋 Unity fermé");
        }
    }

    /**
     * Pause/Resume Unity
     */
    setPaused(paused) {
        if (this.unityInstance) {
            this.unityInstance.SetPaused(paused ? 1 : 0);
            console.log(paused ? "⏸️ Unity en pause" : "▶️ Unity repris");
        }
    }

    /**
     * Retourne les informations de Unity
     */
    getInfo() {
        return {
            isLoaded: !!this.unityInstance,
            isLoading: this.isLoading,
            config: this.config
        };
    }
}

// Export pour utilisation modulaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnityWebGLLoader;
}

// Ajout global pour utilisation directe
window.UnityWebGLLoader = UnityWebGLLoader; 