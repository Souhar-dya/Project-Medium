import { Link } from "react-router-dom";

export interface PostCardProps {
  id: string;
  title: string;
  content: string;
  authorName: string;
  published: boolean;
}

export const PostCard = ({
  id,
  title,
  content,
  authorName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  published,
}: PostCardProps) => {
  const initial = authorName.charAt(0).toUpperCase();

  return (
    <Link to={`/blog/${id}`}>
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow mb-4 cursor-pointer">
        {/* Header with avatar and author name */}
        <div className="flex items-center mb-3">
          <div className="w-9 h-9 bg-gray-200 text-gray-800 flex items-center justify-center rounded-full font-bold text-sm">
            {initial}
          </div>
          <div className="ml-3 text-sm text-gray-600">{authorName}</div>
        </div>

        {/* Blog title */}
        <div className="text-xl font-semibold text-gray-800">{title}</div>

        {/* Content preview */}
        <div className="text-gray-700 mt-2 line-clamp-3">{content}</div>
      </div>
    </Link>
  );
};
