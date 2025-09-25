import { useState, useCallback } from 'react';
import { generateKeyPairAsync, generateKeyPairWithInteractionManager } from '../utils/keyGenerationWorker';

export const useKeyGeneration = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [keyPair, setKeyPair] = useState(null);
    const [error, setError] = useState(null);

    const generateKeys = useCallback(async (useInteractionManager = false) => {
        setIsGenerating(true);
        setError(null);
        
        try {
            const keys = useInteractionManager 
                ? await generateKeyPairWithInteractionManager()
                : await generateKeyPairAsync();
            
            setKeyPair(keys);
            return keys;
        } catch (err) {
            setError(err);
            console.error('Key generation error:', err);
            return null;
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const resetKeys = useCallback(() => {
        setKeyPair(null);
        setError(null);
        setIsGenerating(false);
    }, []);

    return {
        keyPair,
        isGenerating,
        error,
        generateKeys,
        resetKeys
    };
};