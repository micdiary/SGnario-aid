import crypto from "crypto";
import { ENCRYPTION_KEY } from "../constants.js";

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(ENCRYPTION_KEY, "hex");

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + encrypted;
};

const decrypt = (encryptedText) => {
    const iv = Buffer.from(encryptedText.slice(0, 32), "hex");
    const key = Buffer.from(ENCRYPTION_KEY, "hex");
    const encryptedData = encryptedText.slice(32);

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};

export { encrypt, decrypt };
