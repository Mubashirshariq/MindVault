import Button from "../components/Button";
import ShareIcon from "../icons/shareIcon";
import { PlusIcon } from "../icons/plusIcon";
import Card from "../components/Card";
import SideBar from "../components/Sidebar";
import { useEffect, useState } from "react";
import ContentModal from "../components/createContentModal";
import { BACKEND_URL } from "../config";
import ChatWindow from "../components/chatWindow";
import { MenuIcon, XIcon } from "../icons/hamburger";
import axios from "axios";


function Dashboard() {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [SideBarVisibility, setSideBarVisibility] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
  
    try {
      const response = await axios.get(`${BACKEND_URL}/content`, {
        headers: {
          authorization: token,
        },
      });
      setData(response.data.content);
    } catch (error) {
      console.error("Error while fetching data:", error);
      if ((error as any).response?.status === 401) {
        setIsAuthenticated(false);
      }
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const handleBrainShare = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/brain/share`,
        { share: true },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const { hash } = response.data;

      if (!hash) {
        throw new Error("Failed to retrieve the share link hash.");
      }

      const shareUrl = `${window.location.origin}/brain/${hash}`;

      await navigator.clipboard.writeText(shareUrl);
      alert("Share link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing brain:", error);
      alert("Failed to share the brain. Please try again.");
    }
  };

  const filterData = selectedFilter
    ? data.filter((d) => d.type === selectedFilter)
    : data;

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">You need to sign up</h1>
          <p className="mb-4">
            Please <a href="/signup" className="text-blue-600 underline">sign up</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <ContentModal modal={modal} onClose={() => setModal(false)} refreshData={fetchData} />
      <div className="flex h-full">
        <div className={`${SideBarVisibility ? "block z-50" : "hidden"} sm:block`}>
          <SideBar onSelectFilter={setSelectedFilter} />
        </div>
        <div className="flex-1 sm:pl-80 pl-0 flex flex-col p-6">
          <div className="fixed sm:w-3/4 w-full sm:z-20 z-50 flex justify-between items-center bg-white mb-6 p-4 rounded-lg">
            <h1 className="text-lg font-bold p-6 sm:block hidden">All Notes</h1>
            <button
              onClick={() => setSideBarVisibility(!SideBarVisibility)}
              className="sm:hidden ml-3 border border-gray-500 box-border"
            >
              {SideBarVisibility ? <XIcon /> : <MenuIcon />}
            </button>
            <div className="flex space-x-3">
              <Button
                onClick={handleBrainShare}
                text="Share Brain"
                variant="secondary"
                icon={<ShareIcon />}
              />
              <Button
                onClick={() => setModal(true)}
                text="Add Content"
                variant="primary"
                icon={<PlusIcon />}
              />
            </div>
          </div>
          <div className="pt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterData.map((value) => (
              <Card
                key={value._id}
                title={value.title}
                description={value.description}
                type={value.type}
                link={value.link}
                content_id={value._id}
                refreshData={fetchData}
              />
            ))}
          </div>
        </div>
        <div className="fixed bottom-6 right-6">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
