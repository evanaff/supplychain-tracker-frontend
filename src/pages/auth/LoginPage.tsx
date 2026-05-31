import "./LoginPage.css";

function LoginPage() {
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

            <button className="metamask-button">
              <img
                src="/MetaMask-icon-fox.svg"
                alt="MetaMask"
                className="button-icon"
              />
              Connect MetaMask
            </button>

            {/* <div className="security-note">
              <span className="lock-icon">🔒</span>

              <div>
                <p>We do not store your private keys.</p>
                <p>Your wallet connection is secure and encrypted.</p>
              </div>
            </div> */}
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