import type { UploadedImage } from '@prezly/uploadcare';
import { UploadcareImage } from '@prezly/uploadcare';
import { CDN_URL } from '@/constants';

export function getUploadcareImage(
    payload: UploadedImage | null | undefined,
): UploadcareImage | null {
    // Guard against both null and undefined — some SDK objects return undefined for missing images
    if (!payload) {
        return null;
    }

    return UploadcareImage.createFromPrezlyStoragePayload(payload).withBaseCdnUrl(CDN_URL);
}
