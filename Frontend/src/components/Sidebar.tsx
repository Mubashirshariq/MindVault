import SideBarItem from "./SidebarItem";

export default function SideBar(){
    return(
        
        <div className="w-72 min-h-screen pt-6 fixed border shadow-md">
            <SideBarItem title="Tweets" type="twitter"/>
            <SideBarItem title="Videos" type="youtube"/>
            <SideBarItem title="Documents" type="documents"/>
            <SideBarItem title="Links" type="links"/>
            <SideBarItem title="Tags" type="tags"/>
        </div>
        
    )
}