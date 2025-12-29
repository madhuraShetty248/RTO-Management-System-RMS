import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

// Generate a digital signature using HMAC and a secret key
// In a real system, this might use public/private key pairs (RSA/ECDSA)
export const generateDigitalSignature = (data: object): string => {
    const secret = process.env.JWT_SECRET || "default_secret_key_change_me";
    const dataString = JSON.stringify(data);
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(dataString);
    return hmac.digest("hex");
};

// Verify a digital signature
export const verifyDigitalSignature = (data: object, signature: string): boolean => {
    const expectedSignature = generateDigitalSignature(data);
    return signature === expectedSignature;
};
