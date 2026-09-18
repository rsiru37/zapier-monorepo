export function parse(template: string, data: any): string {
    return template.replace(/{([^}]+)}/g, (match, path) => {
        const keys = path.split(".");
        let value: any = data;

        for (const key of keys) {
            if (value && typeof value === "object" && key in value) {
                value = value[key];
            } else {
                return match; // Return original placeholder if path not found
            }
        }

        return value !== null && value !== undefined ? String(value) : match;
    });
}
