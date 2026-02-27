import { useState, useEffect } from 'react';
import { obfuscateData, deobfuscateData } from '../utils/privacy';

function useLocalStorage(key, initialValue, obfuscate = false) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return initialValue;

            if (obfuscate) {
                const deobfuscated = deobfuscateData(item);
                return deobfuscated !== null ? deobfuscated : initialValue;
            } else {
                return JSON.parse(item);
            }
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            if (obfuscate) {
                const obfuscated = obfuscateData(storedValue);
                if (obfuscated) {
                    window.localStorage.setItem(key, obfuscated);
                }
            } else {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            }
            window.dispatchEvent(new Event('local-storage'));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }, [key, storedValue, obfuscate]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;
