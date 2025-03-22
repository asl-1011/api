async function decryptConfig() {
    const key = document.getElementById("decryptKey").value;
    if (!key) {
        alert("Enter decryption key!");
        return;
    }

    try {
        const encryptedConfig = await fetch("config.json.enc").then(res => res.text());
        const decrypted = decryptAES(encryptedConfig, key);
        config = JSON.parse(decrypted);
        alert("API Config Loaded Successfully!");
        document.getElementById("api-section").style.display = "block";
    } catch (error) {
        alert("Decryption failed! Check key.");
    }
}
