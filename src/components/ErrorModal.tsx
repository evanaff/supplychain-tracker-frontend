import "./ErrorModal.css";

type ErrorModalProps = {
  code?: number | string;
  message: string;
  onClose?: () => void;
};

export default function ErrorModal({
  code = 404,
  message,
  onClose,
}: ErrorModalProps) {
  return (
    <div className="error-overlay">
      <div className="error-card">
        <h1 className="error-code">
        {code === 4001 ? "Oops!" : code}
        </h1>

        <p className="error-message">
          {message}
        </p>

        <button
          className="error-button"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}