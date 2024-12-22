import { NotesIcon } from "../icons/notesIcon";
import TrashIcon from "../icons/trashIcon";
import TwitterIcon from "../icons/twitterIcon";
import YoutubeIcon from "../icons/youtubeIcon";
import LinkIcon from "../icons/linkIcon";
import { BACKEND_URL } from "../config";
import axios from "axios";
import toast from "react-hot-toast";

interface CardProps {
    type: "twitter" | "youtube" | "documents" |"links";
    title: string;
    description?: string;
    link:string;
    content_id:string;
    refreshData:()=>void;
}

const icons = {
    youtube: <YoutubeIcon />,
    twitter: <TwitterIcon />,
    documents: <NotesIcon />,
    links:<LinkIcon/>,
};

export default function Card({ type, title, description,link,content_id,refreshData}: CardProps) {
    if (type === "twitter") {
        link = link.replace("x.com", "twitter.com");
    } else if (type === "youtube") {
        const url = new URL(link);
        const videoId = url.searchParams.get("v");
        const extraParams = url.search.substring(url.search.indexOf("&")); 
        link = `https://www.youtube.com/embed/${videoId}${extraParams ? "?" + extraParams : ""}`;
    }

    const handleContentDelete = async () => {
        const loadingToast = toast.loading("Deleting data...", {
            position: "top-center",
          });
        try {
            await axios.delete(`${BACKEND_URL}/content`, { 
                data: { content_id },
                headers:{
                    authorization:localStorage.getItem("token")
                }
             });
            refreshData();
             toast.success("Data deleted successfully", {
                id: loadingToast,
              });
        } catch (error) {
            toast.error("Error while deleting data");
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
                   {type === "links" && (
                    <div className="flex items-center space-x-2">
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {link}
                        </a>
                        <button
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                            title="Open Link"
                        >
                        </button>
                    </div>
                )}

                {type === "documents" && (
                    <div className="flex items-center space-x-2">
                        <button
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                            title="Download Document"
                            onClick={() => window.open(link, "_blank")}
                        >
                            <NotesIcon />
                        </button>
                        <span className="text-gray-600 text-sm">Document</span>
                    </div>
                )}
                {description && (
                    <p className="text-gray-700 text-sm ">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
