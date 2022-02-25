export const enum TileStatus {
    INITIAL = '',
    ABSENT = 'absent',
    PRESENT = 'present',
    CORRECT = 'correct',
    HYBRID = 'hybrid'
}

export interface Tile {
    letter: string;
    status: TileStatus;
}
