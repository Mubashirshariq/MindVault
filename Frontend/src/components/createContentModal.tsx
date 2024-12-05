import { useForm, SubmitHandler } from "react-hook-form";
import { BACKEND_URL } from "../config";
import axios from "axios";
interface ModalProps {
  modal: boolean;
  onClose: () => void;
}

interface Inputs {
  link: string;
  type: "twitter" | "youtube" | "documents";
  title: string;
  description: string;
}

export default function ContentModal({ modal, onClose }: ModalProps) {
  const { handleSubmit, register, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> =async (data) =>{
    try {
      const token=localStorage.getItem("token");
      await axios.post(`${BACKEND_URL}/content`,
        data,
        {
          headers:{
            authorization:token,
          }
        }
    )
    onClose();
    } catch (error) {
      console.log("error",error);
      
    }
  };

  return (
    <div>
      {modal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
            <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">Add Content</h1>
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
              
              <label htmlFor="link" className="text-sm text-gray-600 mb-2">Link</label>
              <input
                className="bg-gray-100 border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="link"
                {...register("link", { required: "Link is required" })}
              />
              {errors.link && <span className="text-red-500 text-sm mb-2">{errors.link.message}</span>}

              <label htmlFor="type" className="text-sm text-gray-600 mb-2">Type</label>
              <select
                id="type"
                className="bg-gray-100 border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("type", { required: "Type is required" })}
              >
                <option value="twitter">Twitter</option>
                <option value="youtube">YouTube</option>
                <option value="documents">Documents</option>
              </select>
              {errors.type && <span className="text-red-500 text-sm mb-2">{errors.type.message}</span>}
              <label htmlFor="title" className="text-sm text-gray-600 mb-2">Title</label>
              <input
                className="bg-gray-100 border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <span className="text-red-500 text-sm mb-2">{errors.title.message}</span>}
              <label htmlFor="description" className="text-sm text-gray-600 mb-2">Description</label>
              <textarea
                id="description"
                className="bg-gray-100 border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                {...register("description", { required: "Description is required" })}
              ></textarea>
              {errors.description && <span className="text-red-500 text-sm mb-2">{errors.description.message}</span>}

              {/* <label htmlFor="tags" className="text-sm text-gray-600 mb-2">Tags (comma-separated)</label> */}
              {/* <input
                className="bg-gray-100 border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="tags"
                {...register("tags", { required: "Tags are required" })}
              />
              {errors.tags && <span className="text-red-500 text-sm mb-2">{errors.tags.message}</span>} */}
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
