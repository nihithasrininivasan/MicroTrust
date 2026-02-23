const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

if (!ML_SERVICE_URL) {
    throw new Error("ML_SERVICE_URL is not defined in environment variables");
}

async function generateScore(userId, features) {
    const response = await fetch(`${ML_SERVICE_URL}/generate-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, features }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`ml-service responded with ${response.status}: ${text}`);
    }

    return response.json();
}

module.exports = { generateScore };
