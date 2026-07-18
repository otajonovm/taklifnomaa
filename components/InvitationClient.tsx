'use client';

import dynamic from 'next/dynamic';

const Invitation = dynamic(() => import('@/components/Invitation'), {
  ssr: false,
  loading: () => (
    <div className="min-h-dvh h-dvh w-full bg-[#fbfbf9] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#c5a880]/35 border-t-[#c5a880] animate-spin" />
    </div>
  ),
});

export default function InvitationClient() {
  return <Invitation />;
}
