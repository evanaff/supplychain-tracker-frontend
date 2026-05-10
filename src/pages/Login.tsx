import { useState } from "react";
import { ethers, getAddress } from "ethers";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  getNonce,
  generateMessage,
  verifySignature,
} from "../services/auth";

// import ErrorModal from "../components/ErrorModal";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  // const [showError, setShowError] = useState(false);

  const showToast = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setToast(message);

    setToastType(type);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Metamask belum terinstall!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const accounts = await provider.send(
        "eth_requestAccounts",
        []
      );

      setAddress(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      setStatus("Verifying...");

      // 1. Get nonce
      const nonceRes = await getNonce(address);
      const nonce = nonceRes.nonce;

      const provider = new ethers.BrowserProvider(
        window.ethereum
      );

      const network = await provider.getNetwork();

      const signer = await provider.getSigner();

      const checksumAddress = getAddress(address);

      const domain = window.location.host;

      const uri = window.location.origin;

      const version = "1";

      const chainId = Number(network.chainId);

      // 2. Generate message
      const messageRes = await generateMessage(
        domain,
        checksumAddress,
        uri,
        version,
        chainId,
        nonce
      );

      const message = messageRes.message;

      setStatus("Verifying...");

      // 3. Sign
      const signature = await signer.signMessage(message);

      setStatus("Verifying...");

      // 4. Verify
      const verifyRes = await verifySignature(
        message,
        signature
      );

      // setStatus("Login berhasil!");

      localStorage.setItem("token", verifyRes.token);

      localStorage.setItem("role", verifyRes.role);

      const role = verifyRes.role;

      if (role === "ADMIN") {
        navigate("/admin/actors");
      }

      if (role === "GROWER") {
        navigate("/grower/create");
      }

      if (role === "DISTRIBUTOR") {
        navigate("/distributor");
      }

      if (role === "RETAILER") {
        navigate("/retailer");
      }
    } catch (err: any) {
      console.error(err);

      setStatus("");

      // USER CANCEL METAMASK
      const isUserRejected =
        err?.code === "ACTION_REJECTED" ||
        err?.code === 4001 ||
        err?.info?.error?.code === 4001 ||
        err?.error?.code === 4001;

      if (isUserRejected) {
        showToast(
          "Signature request cancelled",
          "info"
        );

        return;
      }

      // BACKEND ERROR
      if (axios.isAxiosError(err)) {
        showToast(
          err.response?.data?.message ||
            "Request failed",
          "error"
        );

        return;
      }

      // NORMAL ERROR
      if (err instanceof Error) {
        showToast(err.message, "error");

        return;
      }

      // UNKNOWN
      showToast("Unknown error", "error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">LOGIN</h1>

        {/* BELUM CONNECT */}
        {!address && (
          <>
            <div className="wallet-box">
              <span className="wallet-placeholder">
                Please connect your wallet...
              </span>
            </div>

            <button
              className="connect-button"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </>
        )}

        {/* SUDAH CONNECT */}
        {address && (
          <>
            <div className="wallet-box">
              <span className="wallet-address">
                {address.slice(0, 10)}...
                {address.slice(-8)}
              </span>
            </div>

            <button
              className="login-button"
              onClick={handleLogin}
            >
              Verify Signature
            </button>
          </>
        )}

        {status && (
          <p className="status-text">
            {status}
          </p>
        )}

      {
        toast && (
          <div className={`toast toast-${toastType}`}>
            {toast}
          </div>
        )
      }
      </div>
    </div>
  );
}