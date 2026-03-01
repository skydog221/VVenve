declare global {
    interface Window {
        VVENVE: VM;
        injectVVenve: () => void;
    }
}
export { };