import { useState, useEffect } from 'react';
import { obfuscateData, deobfuscateData } from '../utils/privacy';

function useLocalStorage(key, initialValue, obfuscate = false) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            if (!item) return initialValue;

            if (obfuscate) {
                const deobfuscated = deobfuscateData(item);
                return deobfuscated !== null ? deobfuscated : initialValue;
            } else {
                return JSON.parse(item);
            }
        } catch (error) {
            // If error also return initialValue
            console.error(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== "undefined") {
                if (obfuscate) {
                    const obfuscated = obfuscateData(valueToStore);
                    if (obfuscated) {
                        window.localStorage.setItem(key, obfuscated);
                    }
                } else {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }

                // Dispatch a custom event so other components can listen if needed
                window.dispatchEvent(new Event('local-storage'));
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
