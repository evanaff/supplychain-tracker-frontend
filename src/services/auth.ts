import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export async function getNonce(address: string) {
  const res = await axios.get(`${apiUrl}/auth/nonce`, {
    params: { address },
  });
  return res.data.data;
}

export async function generateMessage(
  domain: string,
  address: string,
  uri: string,
  version: string,
  chainId: number,
  nonce: string
) {
  const res = await axios.post(`${apiUrl}/auth/message`, {
    domain,
    address,
    uri,
    version,
    chainId,
    nonce
  });
  return res.data.data;
}

export async function verifySignature(message: string, signature: string) {
  const res = await axios.post(`${apiUrl}/auth/verify`, {
    message,
    signature,
  });
  return res.data.data;
}