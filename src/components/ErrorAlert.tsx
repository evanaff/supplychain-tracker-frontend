interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({
  message,
}: ErrorAlertProps) {

  if (!message) return null;

  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#ffebee",
        color: "#c62828",
        border: "1px solid #ef9a9a",
      }}
    >
      {message}
    </div>
  );
}