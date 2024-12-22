import SideBarItem from "./SidebarItem";

interface SideBarProps {
  onSelectFilter: (filter: string) => void;
}

export default function SideBar({ onSelectFilter }: SideBarProps) {
  return (
    <div className="sm:w-72 w-52 min-h-screen pt-6 fixed top-0 left-0 border bg-gray-200">
      <SideBarItem title="MindVault" type="header" onClick={() => {}} />
      <SideBarItem onClick={() => onSelectFilter("twitter")} title="Tweets" type="twitter" />
      <SideBarItem onClick={() => onSelectFilter("youtube")} title="Videos" type="youtube" />
      <SideBarItem onClick={() => onSelectFilter("documents")} title="Documents" type="documents" />
      <SideBarItem onClick={() => onSelectFilter("links")} title="Links" type="links" />
    </div>
  );
}
