import YoutubeIcon from "../icons/youtubeIcon";
import TwitterIcon from "../icons/twitterIcon";
import { NotesIcon } from "../icons/notesIcon";
import LinkIcon from "../icons/linkIcon";
import TagIcon from "../icons/tagIcon";
import Brain from "../icons/Brain";

const icons = {
    youtube: <YoutubeIcon />,
    twitter: <TwitterIcon />,
    documents: <NotesIcon />,
    links: <LinkIcon/>,
    tags:<TagIcon/>,
    header:<Brain/>
};
interface SideBarItemProps{
    type:"twitter"|"youtube"|"documents"|"links"|"tags"|"header",
    title:string,
}
export default function SideBarItem({type,title}:SideBarItemProps){


    return (
        <div className={`flex items-center p-4 ml-4 hover:cursor-pointer ${type!=='header'? 'hover:bg-gray-400':''} `}>
            <div className="mr-2">
            {icons[type]}
            </div>
            <div className={`${type === 'header' ? 'font-extrabold font-sans text-blue-600 text-2xl' : ''}`}>
            {title}
            </div>

            
        </div> 
    )
}