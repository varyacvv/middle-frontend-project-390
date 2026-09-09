interface LoadingProps {
  text?: string;
  testId?: string;
}

function Loading({ text = 'Загрузка...', testId }: LoadingProps) {
  return (
    <div className="text-muted" data-testid={testId}>
      {text}
    </div>
  );
}

export default Loading;