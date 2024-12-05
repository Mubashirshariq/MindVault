import { NotesIcon } from "../icons/notesIcon";
import ShareIcon from "../icons/shareIcon";
import TrashIcon from "../icons/trashIcon";
import TwitterIcon from "../icons/twitterIcon";
import YoutubeIcon from "../icons/youtubeIcon";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface CardProps {
    type: "twitter" | "youtube" | "note";
    title: string;
    description?: string;
    link:string;
    content_id:string;
}

const icons = {
    youtube: <YoutubeIcon />,
    twitter: <TwitterIcon />,
    note: <NotesIcon />,
};

export default function Card({ type, title, description,link,content_id }: CardProps) {
    if (type === "twitter") {
        link = link.replace("x.com", "twitter.com");
    } else if (type === "youtube") {
        const url = new URL(link);
        const videoId = url.searchParams.get("v");
        const extraParams = url.search.substring(url.search.indexOf("&")); 
        link = `https://www.youtube.com/embed/${videoId}${extraParams ? "?" + extraParams : ""}`;
    }

    const handleContentDelete = async () => {
        try {
            await axios.delete(`${BACKEND_URL}/content`, { 
                data: { content_id },
                headers:{
                    authorization:localStorage.getItem("token")
                }
             });
        } catch (error) {
            console.log("error", error);
        }
    }
    return (
        <div className="max-w-72  mx-auto rounded-lg  border-gray-300 shadow-md  bg-white transition transform hover:scale-105 hover:shadow-xl">
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
                        className="p-2 rounded-full hover:bg-red-200 cursor-pointer transition"
                        title="Delete"
                        onClick={handleContentDelete}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {type === "youtube" && (
                        <iframe
                            className="w-full h-full rounded-md"
                            src={link}
                        ></iframe>
                 
                )}
                {type === "twitter" && (
                   
                       <blockquote className="twitter-tweet">
                        <a href={link}></a> 
                        </blockquote>
                   
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
