import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import SideBar from "./Sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import Card from "./Card";

export default function SharedBrain() {
    const [data, setData] = useState<any>({});
    const { hash } = useParams();
    console.log("hash, ", hash);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/brain/${hash}`)
            .then((response) => {
                console.log(response);
                setData(response.data);
            })
            .catch((error) => {
                console.log("Error while fetching content", error);
            });
    }, [hash]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <div className="flex h-full">
                <div className="">
                    <SideBar onSelectFilter={()=>{}}/>
                </div>

                <div className="flex-1 pl-80 flex flex-col p-6">
                    <div className="fixed w-3/4 z-10 flex justify-between items-center bg-white mb-6 p-4 rounded-lg ">
                        <h1 className="text-lg font-bold p-6">All Notes</h1>
                        <div className="flex space-x-3">
                            <h1 className="text-2xl font-bold">{data.username}</h1>
                        </div>
                    </div>
                    <div className="pt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.content && data.content.map((value: any) => (
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
            </div>
        </div>
    );
}
