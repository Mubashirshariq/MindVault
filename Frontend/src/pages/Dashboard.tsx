import Button from "../components/Button";
import ShareIcon from "../icons/shareIcon";
import { PlusIcon } from "../icons/plusIcon";
import Card from "../components/Card";
import SideBar from "../components/Sidebar";
import { useEffect, useState } from "react";
import ContentModal from "../components/createContentModal";
import { BACKEND_URL } from "../config";
import ChatWindow from "../components/chatWindow";
import axios from "axios";

function Dashboard() {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/content`, {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setData(response.data.content);
      })
      .catch((error) => {
        console.log("Error while fetching data:", error);
      });
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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <ContentModal modal={modal} onClose={() => setModal(false)} />
      <div className="flex h-full">
        <div className={``}>
          <SideBar />
        </div>
        <div className="flex-1 pl-80 flex flex-col p-6">
          <div className="fixed w-3/4 z-10 flex justify-between items-center bg-white mb-6 p-4 rounded-lg">
            <h1 className="text-lg font-bold p-6">All Notes</h1>
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
            {data.map((value) => (
              <Card
                key={value._id}
                title={value.title}
                description={value.description}
                type={value.type}
                link={value.link}
                content_id={value._id}
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

