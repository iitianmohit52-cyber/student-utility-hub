/**
 * Utility to submit URLs to the IndexNow API.
 * Can be used in both browser and Node.js (v18+) environments.
 */
export async function submitToIndexNow(urls, host = "student-utility-hub-2ss3.vercel.app") {
    const key = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
    const keyLocation = `https://${host}/${key}.txt`;

    const data = {
        host: host,
        key: key,
        keyLocation: keyLocation,
        urlList: Array.isArray(urls) ? urls : [urls]
    };

    try {
        const response = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data)
        });

        if (response.ok || response.status === 200 || response.status === 202) {
            console.log(`IndexNow submission successful for ${data.urlList.length} URL(s)`);
            return true;
        } else {
            console.error("IndexNow submission failed with status:", response.status);
            return false;
        }
    } catch (error) {
        console.error("Error submitting to IndexNow:", error);
        return false;
    }
}
