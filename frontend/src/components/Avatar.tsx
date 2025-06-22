type AvatarProps = {
  authorName: string;
};

export const Avatar = ({ authorName }: AvatarProps) => {
  const initial = authorName.charAt(0).toUpperCase();

  return (
    <div className="w-7 h-7 rounded-full bg-gray-300 text-black flex items-center justify-center text-sm font-bold">
      {initial}
    </div>
  );
};
