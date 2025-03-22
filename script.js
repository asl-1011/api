async function fetchData() {
    if (!config) {
        alert("API config not loaded. Enter decryption key first!");
        return;
    }

    const apiSelect = document.getElementById("apiSelect").value;
    const queryInput = document.getElementById("queryInput").value;
    const responseContainer = document.getElementById("responseContainer");

    if (!queryInput) {
        alert("Enter a value to search.");
        return;
    }

    let apiUrl, payload = {};
    switch (apiSelect) {
        case "vehicle":
            apiUrl = config.vehicleAPI;
            payload = { vehicleNumber: queryInput, blacklistCheck: true };
            break;
        case "pan":
            apiUrl = config.panAPI;
            payload = { panNumber: queryInput };
            break;
        case "phone":
            apiUrl = config.phoneAPI;
            payload = { mobileNumber: queryInput };
            break;
        case "aadhar":
            apiUrl = config.aadharAPI;
            payload = { aadharNumber: queryInput };
            break;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "clientId": config.clientId,
                "secretKey": config.secretKey
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        displayResult(data);
    } catch (error) {
        responseContainer.innerHTML = "<p style='color:red;'>Error fetching data!</p>";
    }
}

function displayResult(result) {
    const responseContainer = document.getElementById("responseContainer");
    responseContainer.innerHTML = "<h3>Results</h3>";

    let tableHTML = `<div class="table-wrapper"><table><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>`;

    function formatKey(key) {
        return key
            .replace(/RESULT →\s*/gi, '')
            .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\s+/g, " ") // Remove extra spaces
            .trim()
            .toUpperCase();
    }

    function parseObject(obj, parentKey = "") {
        for (let key in obj) {
            let value = obj[key];

            if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
                continue; // Skip empty fields
            }

            let formattedKey = formatKey(parentKey ? `${parentKey} → ${key}` : key);
            formattedKey = formattedKey.replace(/\s+→\s+/g, " → "); // Fix spacing issues

            if (typeof value === "object" && !Array.isArray(value)) {
                parseObject(value, formattedKey);
            } else {
                tableHTML += `<tr><td>${formattedKey}</td><td>${value}</td></tr>`;
            }
        }
    }

    parseObject(result);

    tableHTML += `</tbody></table></div>`;
    responseContainer.innerHTML += tableHTML;
}
