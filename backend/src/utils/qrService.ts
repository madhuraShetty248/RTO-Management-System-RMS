import qrcode from "qrcode";

export const generateQrCode = async (data: string): Promise<string> => {
    try {
        // Generate QR code as a Data URL (base64 image)
        const qrCodeDataUrl = await qrcode.toDataURL(data);
        return qrCodeDataUrl;
    } catch (err) {
        console.error("Error generating QR code:", err);
        throw new Error("Failed to generate QR code");
    }
};
