import SideBarItem from "./SidebarItem";

export default function SideBar(){
    return(

        <div className="w-72 min-h-screen pt-6 fixed top-0 left-0 border shadow-md">
            <SideBarItem title="MindVault" type="header"/>
            <SideBarItem title="Tweets" type="twitter"/>
            <SideBarItem title="Videos" type="youtube"/>
            <SideBarItem title="Documents" type="documents"/>
            <SideBarItem title="Links" type="links"/>
            <SideBarItem title="Tags" type="tags"/>
        </div>
        
    )
}