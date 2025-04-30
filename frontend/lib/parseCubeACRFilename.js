export function parseCubeACRFilename(filename) {
    const regex = /^(phone|whatsapp|telegram|viber|skype)[_\-]{1,2}(\d{8})-(\d{6})[_\-]?(\+?\d+)?\.(amr|mp4|wav)$/i;
    const match = filename.match(regex);

    if (!match) {
        return false;
    }

    const [_, source, date, time, number, format] = match;

    return {
        source, 
        date: `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`, 
        time: `${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)}`,
        number: number || "Unknown", 
        format 
    };
}
