
export function capitalize(str?: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDragon(dragon: any) {
    return {
        ...dragon,
        name: capitalize(dragon.name),
        type: capitalize(dragon.type),
    };
}