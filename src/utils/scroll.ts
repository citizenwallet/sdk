export const isRefScrollable = (ref: React.RefObject<HTMLDivElement>) => {
  if (ref.current) {
    return ref.current.scrollHeight > ref.current.clientHeight;
  }

  return false;
};
