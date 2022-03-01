export const enum TileStatus {
    INITIAL = '',
    ABSENT = 'absent',
    PRESENT = 'present',
    CORRECT = 'correct'
}

export interface Tile {
    letter: string;
    status: TileStatus;
}
