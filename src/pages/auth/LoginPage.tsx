import { useState } from "react";
import { ethers, getAddress } from "ethers";
import { useNavigate } from "react-router-dom";

import { verifySignature, generateMessage } from "../../api/authApi";
import "./LoginPage.css";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

function LoginPage() {
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    async function connectWallet() {
        const provider =
            new ethers.BrowserProvider(
                window.ethereum
            );

        const accounts =
            await provider.send(
                "eth_requestAccounts",
                []
            );

        setAddress(accounts[0]);
    }

    async function handleLogin() {
        try {
            setLoading(true);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            const checksumAddress = getAddress(address);
            const domain = window.location.host;
            const uri = window.location.origin;
            const version = "1";
            const chainId = Number(network.chainId);

            const res = await generateMessage(
                domain,
                checksumAddress,
                uri,
                version,
                chainId,
            );

            const message = res.message;

            const signature =
                await signer.signMessage(message);
            
            const verifyRes =
                await verifySignature(
                    message,
                    signature
                );

            const {
                accessToken,
                refreshToken,
                actor,
            } = verifyRes;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("role", actor.role);
            localStorage.setItem("walletAddress", actor.address);

            if (actor.role === "ADMIN") {
                navigate(`/${actor.role.toLowerCase()}/dashboard`);
            } else {
                navigate(`/${actor.role.toLowerCase()}/trace-products`);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{
                message: string
            }>;
            toast.error(axiosError.response?.data.message ?? "Login failed. Please try again.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                {/* LEFT SECTION */}
                <div className="login-left">
                    <div className="brand">
                        <div className="brand-text">
                            <h2>Supply Chain Tracker</h2>
                        </div>
                    </div>

                    <div className="welcome-section">
                        <h1>
                            Welcome Back
                            <br />
                            <span>Sign in to continue</span>
                        </h1>

                        <p>
                            Connect your MetaMask wallet
                        </p>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="login-right">
                    <div className="login-card">
                        <div className="metamask-icon-wrapper">
                            <img
                                src="/MetaMask-icon-fox.svg"
                                alt="MetaMask"
                                className="metamask-icon"
                            />
                        </div>

                        <h2>Connect with MetaMask</h2>

                        <p className="card-description">
                            Use your MetaMask wallet to securely sign in and access your account.
                        </p>

                        <div className="divider" />

                        <div className="wallet-section">
                            {address && (
                                <div className="wallet-info">
                                    <label>Connected Wallet</label>

                                    <div className="wallet-address">
                                        {address}
                                    </div>

                                    <button
                                        className="change-wallet-button"
                                        onClick={connectWallet}
                                        type="button"
                                    >
                                        Change Wallet
                                    </button>
                                </div>
                            )}
                        </div>

                        {!address ? (
                            <button
                                className="metamask-button"
                                onClick={connectWallet}
                            >
                                Connect MetaMask
                            </button>
                        ) : (
                            <button
                                className="metamask-button"
                                onClick={handleLogin}
                                disabled={loading}
                            >
                                {loading
                                    ? "Signing..."
                                    : "Verify Signature"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;