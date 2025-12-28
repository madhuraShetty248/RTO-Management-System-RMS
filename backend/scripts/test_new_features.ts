import { generateQrCode } from "../src/utils/qrService";
import { generateDigitalSignature, verifyDigitalSignature } from "../src/utils/cryptoService";
import dotenv from "dotenv";

dotenv.config();

const testFeatures = async () => {
    console.log("--- Testing New Features ---");

    // 1. Digital Signature
    console.log("\n1. Testing Digital Signature...");
    const data = { id: 123, type: "TEST" };
    const signature = generateDigitalSignature(data);
    console.log("Data:", data);
    console.log("Signature:", signature);

    const isValid = verifyDigitalSignature(data, signature);
    console.log("Verification (Original):", isValid ? "PASS" : "FAIL");

    const isInvalid = verifyDigitalSignature({ ...data, type: "TAMPERED" }, signature);
    console.log("Verification (Tampered):", !isInvalid ? "PASS" : "FAIL");

    // 2. QR Code
    console.log("\n2. Testing QR Code Generation...");
    try {
        const qrCode = await generateQrCode(JSON.stringify({ ...data, sig: signature }));
        console.log("QR Code Data URL length:", qrCode.length);
        console.log("QR Code snippet:", qrCode.substring(0, 50) + "...");
        console.log("QR Code test: PASS");
    } catch (e) {
        console.error("QR Code test: FAIL", e);
    }
};

testFeatures();
