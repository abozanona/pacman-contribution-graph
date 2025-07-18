export declare enum Sound {
    DEFAULT = "https://cdn.jsdelivr.net/npm/pacman-contribution-graph/src/assets/sounds/pacman_chomp.wav",
    BEGINNING = "https://cdn.jsdelivr.net/npm/pacman-contribution-graph/src/assets/sounds/pacman_beginning.wav",
    GAME_OVER = "https://cdn.jsdelivr.net/npm/pacman-contribution-graph/src/assets/sounds/pacman_death.wav",
    EAT_GHOST = "https://cdn.jsdelivr.net/npm/pacman-contribution-graph/src/assets/sounds/pacman_eatghost.wav"
}
export declare class MusicPlayer {
    private static instance;
    private audioContext;
    private sounds;
    private currentSource;
    private defaultSource;
    isMuted: boolean;
    private constructor();
    static getInstance(): MusicPlayer;
    preloadSounds(): Promise<void>;
    play(sound: Sound): Promise<void>;
    startDefaultSound(): void;
    stopDefaultSound(): void;
    mute(): void;
    unmute(): void;
}
