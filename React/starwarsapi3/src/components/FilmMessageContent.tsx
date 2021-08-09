export const FilmMessageContent = ({ children }: { children: any }) => {
  return (
    <div className='film no-border'>
      <div className='messages'>{children}</div>
    </div>
  );
};
