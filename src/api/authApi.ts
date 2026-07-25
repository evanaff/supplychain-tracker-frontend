import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_URL}/auth`;

export async function generateMessage(
    domain: string,
    address: string,
    uri: string,
    version: string,
    chainId: number,
) {
    const res = await axios.post(
        `${apiUrl}/message`, 
        {
            domain,
            address,
            uri,
            version,
            chainId,
        }
    );

    return res.data.data;
}

export async function verifySignature(message: string, signature: string) {
    const res = await axios.post(
        `${apiUrl}/verify`, 
        {
            message,
            signature,
        }
    );
    return res.data.data;
}

export async function deleteRefreshToken(refreshToken: string) {
    const res = await axios.post(
        `${apiUrl}/logout`,
        {
            refreshToken
        }
    );

    return res;
}