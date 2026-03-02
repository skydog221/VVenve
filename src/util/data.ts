export function use<T extends unknown[]>(...data: T): T {
    return data;
}
export function download(data: Blob | string, filename: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data]));
    a.download = filename;
    a.click();
}