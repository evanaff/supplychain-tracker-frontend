import { useState } from "react";
import { ethers, getAddress } from "ethers";
import { useNavigate } from "react-router-dom";

import { getNonce, generateMessage, verifySignature } from "../../api/authApi";
import "./LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    async function connectWallet() {
        try {
            if (!window.ethereum) {
                alert("MetaMask is not installed");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setAddress(accounts[0]);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleLogin() {
        try {
            setLoading(true);

            const nonceRes = await getNonce(address);
            const nonce = nonceRes.nonce;

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            const checksumAddress = getAddress(address);
            const domain = window.location.host;
            const uri = window.location.origin;
            const version = "1";
            const chainId = Number(network.chainId);

            const messageRes =await generateMessage(
                domain,
                checksumAddress,
                uri,
                version,
                chainId,
                nonce
            );

            const message =
                messageRes.message;

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

            navigate(`/${actor.role.toLowerCase()}/trace-products`);
        } catch (err) {
            console.error(err);
            alert("Login failed. Please try again.");
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
                        <div className="brand-logo">
                            <span>SC</span>
                        </div>

                        <div className="brand-text">
                            <h2>Supply Chain Tracker</h2>
                            <p>Blockchain-Powered Traceability</p>
                        </div>
                    </div>

                    <div className="welcome-section">
                        <h1>
                            Welcome Back
                            <br />
                            <span>Sign in to continue</span>
                        </h1>

                        <p>
                            Connect your MetaMask wallet to access the Supply Chain
                            Tracker dashboard.
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
                            Use your MetaMask wallet to securely sign in and access your
                            account.
                        </p>

                        <div className="divider" />

                        {!address ? (
                            <button
                                className="metamask-button"
                                onClick={
                                    connectWallet
                                }
                            >
                                <img
                                    src="/MetaMask-icon-fox.svg"
                                    alt="MetaMask"
                                    className="button-icon"
                                />

                                Connect MetaMask
                            </button>
                        ) : (
                            <>
                                <p>
                                    Connected:
                                    <br />
                                    {address.slice(
                                        0,
                                        8
                                    )}
                                    ...
                                    {address.slice(-6)}
                                </p>

                                <button
                                    className="metamask-button"
                                    onClick={
                                        handleLogin
                                    }
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Signing..."
                                        : "Verify Signature"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <footer className="login-footer">
                © 2026 Supply Chain Tracker. All rights reserved.
            </footer>
        </div>
    );
}

export default LoginPage;