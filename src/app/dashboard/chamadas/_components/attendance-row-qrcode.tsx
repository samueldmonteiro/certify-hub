'use client';

import { useEffect, useState } from 'react';
import { AttendanceLinkQRCode } from './attendance-link-qrcode';

interface AttendanceRowQRCodeProps {
  callId: string;
  callName: string;
}

export function AttendanceRowQRCode({ callId, callName }: AttendanceRowQRCodeProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(`${window.location.origin}/presenca/${callId}`);
  }, [callId]);

  return (
    <AttendanceLinkQRCode
      url={url}
      fileName={`qrcode-chamada-${callName.replace(/\s+/g, '-').toLowerCase()}`}
      triggerVariant="ghost"
      triggerSize="icon"
      triggerLabel=""
    />
  );
}
