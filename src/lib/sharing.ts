import { toast } from 'react-hot-toast';

export const shareToWhatsApp = (text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
};

export const shareToInstagram = async (text: string) => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Norinly',
                text: text,
                url: 'https://norinly.live',
            });
            return true;
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
            return false;
        }
    } else {
        // Fallback for browsers that don't support Web Share API
        copyToClipboard('https://norinly.live', 'Link copied! Share it on your Instagram story 📸');
        return false;
    }
};

export const copyToClipboard = async (text: string, successMessage = 'Link copied to clipboard! 🚀') => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(successMessage);
        return true;
    } catch (err) {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy link.');
        return false;
    }
};

export const getSharingMessage = (countryName?: string) => {
    const baseMessage = "I've been practicing English by talking to real people on Norinly. Try it here: https://norinly.live";
    if (countryName) {
        return `I just talked to someone from ${countryName} 🌍 on Norinly! I'm practicing my English with real people worldwide. Practice with me here: https://norinly.live`;
    }
    return baseMessage;
};
