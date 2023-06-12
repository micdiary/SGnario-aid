import crypto from "crypto";

const encrypt = (text, encryptionKey) => {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(encryptionKey, "hex");

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + encrypted;
};

const decrypt = (encryptedText, encryptionKey) => {
    const iv = Buffer.from(encryptedText.slice(0, 32), "hex");
    const key = Buffer.from(encryptionKey, "hex");
    const encryptedData = encryptedText.slice(32);

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};

export { encrypt, decrypt };
