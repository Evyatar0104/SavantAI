/**
 * Converts an rgba or rgb color string to a hex color string.
 * @param rgba The color string (e.g., "rgba(255, 255, 255, 0.5)" or "rgb(0, 0, 0)")
 * @returns The hex string prefixed with #
 */
export const getHexFromRgba = (rgba: string): string => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
        return `#${((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1)}`;
    }
    return "#ffffff";
};
