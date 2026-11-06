export function Mark({
  className = "h-12 w-auto",
  alt = "VT Seva",
}: {
  className?: string;
  alt?: string;
}) {
  return <img src="/vt-seva-logo.png" alt={alt} className={className} />;
}
