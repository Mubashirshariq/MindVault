import { NotesIcon } from "../icons/notesIcon";
import ShareIcon from "../icons/shareIcon";
import TrashIcon from "../icons/trashIcon";
import TwitterIcon from "../icons/twitterIcon";
import YoutubeIcon from "../icons/youtubeIcon";

interface CardProps {
    type: "twitter" | "youtube" | "note";
    title: string;
    description?: string;
    link:string
}

const icons = {
    youtube: <YoutubeIcon />,
    twitter: <TwitterIcon />,
    note: <NotesIcon />,
};

export default function Card({ type, title, description,link }: CardProps) {
    if (type === "twitter") {
        link = link.replace("x.com", "twitter.com");
    } else if (type === "youtube") {
        const url = new URL(link);
        const videoId = url.searchParams.get("v");
        const extraParams = url.search.substring(url.search.indexOf("&")); 
        link = `https://www.youtube.com/embed/${videoId}${extraParams ? "?" + extraParams : ""}`;
    }

    return (
        <div className="max-w-72 mx-auto rounded-lg border border-gray-300 shadow-md overflow-hidden bg-white transition transform hover:scale-105 hover:shadow-xl">
            <div className="flex justify-between items-center bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="mr-3 text-gray-600">{icons[type]}</div>
                    <h2 className="text-lg font-medium text-gray-800">{title}</h2>
                </div>
                <div className="flex items-center">
                    <button
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                        title="Share"
                    >
                        <ShareIcon />
                    </button>
                    <button
                        className="p-2 rounded-full hover:bg-red-200 transition"
                        title="Delete"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {type === "youtube" && (
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe
                            className="w-full h-full rounded-md"
                            src={link}
                        ></iframe>
                    </div>
                )}
                {type === "twitter" && (
                    <div className="aspect-w-16 aspect-h-9 ">
                       <blockquote className="twitter-tweet">
                        <a href={link}></a> 
                        </blockquote>
                    </div>
                )}

                {description && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
