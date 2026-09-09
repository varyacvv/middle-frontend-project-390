interface ErrorMessageProps {
  message: string;
  testId?: string;
}

function ErrorMessage({ message, testId }: ErrorMessageProps) {
  return (
    <div className="alert alert-danger" data-testid={testId}>
      {message}
    </div>
  );
}

export default ErrorMessage;