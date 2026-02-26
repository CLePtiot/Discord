import { useCallback, useRef } from 'react';

/**
 * Plays short synthesized audio blips using the Web Audio API.
 * No external files needed — sounds are generated on-the-fly.
 *
 * Usage:
 *   const { playMessageSend, playMessageReceive, playCommandOpen } = useSoundFeedback(enabled);
 */
export default function useSoundFeedback(enabled = true) {
    const ctxRef = useRef(null);

    const getCtx = useCallback(() => {
        if (!ctxRef.current) {
            ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return ctxRef.current;
    }, []);

    // Helper: play a short tone
    const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.12) => {
        if (!enabled) return;
        try {
            const ctx = getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);
            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch {
            // Silently fail if AudioContext is not supported
        }
    }, [enabled, getCtx]);

    /** Ascending blip — message sent */
    const playMessageSend = useCallback(() => {
        if (!enabled) return;
        try {
            const ctx = getCtx();
            // Two-note ascending
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc1.type = 'sine';
            osc2.type = 'sine';
            osc1.frequency.setValueAtTime(600, ctx.currentTime);
            osc2.frequency.setValueAtTime(900, ctx.currentTime + 0.06);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            osc1.start(ctx.currentTime);
            osc1.stop(ctx.currentTime + 0.06);
            osc2.start(ctx.currentTime + 0.06);
            osc2.stop(ctx.currentTime + 0.15);
        } catch { /* */ }
    }, [enabled, getCtx]);

    /** Soft descending blip — message received */
    const playMessageReceive = useCallback(() => {
        playTone(880, 0.1, 'sine', 0.06);
    }, [playTone]);

    /** Crisp click — command palette open */
    const playCommandOpen = useCallback(() => {
        playTone(1200, 0.06, 'triangle', 0.1);
    }, [playTone]);

    return { playMessageSend, playMessageReceive, playCommandOpen };
}
