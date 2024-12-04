import Button from "../components/Button";
import ShareIcon from "../icons/shareIcon";
import { PlusIcon } from "../icons/plusIcon";
import Card from "../components/Card";
import SideBar from "../components/Sidebar";
import { useState } from "react";
import ContentModal from "../components/createContentModal";

function Dashboard() {
  const [modal,setModal]=useState(false);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
     <ContentModal modal={modal} onClose={()=>setModal(false)}/>
      <div className="flex h-full">
        <div className={``}>
        <SideBar />
        </div>
        
        <div className="flex-1 pl-80 flex flex-col p-6">
            <div className=" fixed w-3/4  z-10  flex justify-between items-center bg-white mb-6  p-4 rounded-lg ">
              <h1 className="text-lg font-bold p-6">All Notes</h1>
              <div className="flex space-x-3">
                <Button  text="Share Brain" variant="secondary" icon={<ShareIcon />} />
                <Button onClick={()=>setModal(true)} text="Add Content" variant="primary" icon={<PlusIcon />} />
              </div>
            </div>
            <div className="pt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                type="twitter"
                title="First Tweet"
                description="Hey there, this is my first tweet!"
                link="https://x.com/HumansNoContext/status/1863974018388295974"
              />
              <Card
                type="youtube"
                title="First Video"
                description="Check out this awesome video!"
                link="https://www.youtube.com/watch?v=1damIEq1Pxg&list=RD1damIEq1Pxg&start_radio=1"
              />
              <Card
                type="youtube"
                title="First Video"
                description="Check out this awesome video!"
                link="https://www.youtube.com/watch?v=1damIEq1Pxg&list=RD1damIEq1Pxg&start_radio=1"
              />
              <Card
                type="youtube"
                title="First Video"
                description="Check out this awesome video!"
                link="https://www.youtube.com/watch?v=1damIEq1Pxg&list=RD1damIEq1Pxg&start_radio=1"
              />
              <Card
                type="youtube"
                title="First Video"
                description="Check out this awesome video!"
                link="https://www.youtube.com/watch?v=1damIEq1Pxg&list=RD1damIEq1Pxg&start_radio=1"
              />

            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
