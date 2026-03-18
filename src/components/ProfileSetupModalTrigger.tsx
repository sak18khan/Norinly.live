'use client';

import { useChatContext } from '@/context/ChatContext';
import ProfileSetupModal from './ProfileSetupModal';

export default function ProfileSetupModalTrigger() {
    // const { showProfileSetupModal, setShowProfileSetupModal } = useChatContext();

    return null;
    /* Disabled: This popup is irritating
    return (
        <ProfileSetupModal
            isOpen={showProfileSetupModal}
            onClose={() => setShowProfileSetupModal(false)}
        />
    );
    */
}
