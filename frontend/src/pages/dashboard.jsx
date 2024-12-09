import { useStateContext } from "../context/contextProvider";
import API from "../API";
import SideBar from "../components/sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const {user} = useStateContext();
    const [selectedTable, setSelectedTable] = useState(null);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(selectedTable){
            setFormData({});

            const fetchTableData = async () => {
              setIsLoading(true);
              try{
                const rowsResponse = await API.get(`/${selectedTable.toLowerCase()}`)
                setRows(rowsResponse.data);
                console.log("API Response:", rowsResponse);

                if (rowsResponse.data.length > 0) {
                  setColumns(Object.keys(rowsResponse.data[0]));
                  
                } else {
                    setColumns([]);
                    alert("No data found for the selected table.");
                }
              } catch(error) {
                  console.error("Error fetching data", error);
              } finally {
                  setIsLoading(false);
              }  
            }

            fetchTableData();
        }
    },[selectedTable])


    const handleInputChange = (e, columnName) => {
        setFormData({ ...formData, [columnName]: e.target.value });
    };

    const handleSubmit = async () => {
        if (formData.id) {
          await handleUpdate(formData.id);
        } else {
          await handleCreate();
        }
      };
    
    const handleCreate = async () => {
      const endpoint = getOperationEndpoint();
        try {
            const response = await API.post(`/${endpoint}`, formData);
            alert("Row created!");

            setRows((prevRows) => [...prevRows, response.data]);

            setFormData({});
        } catch (error) {
            console.error("Error creating row:", error);
        }
    };

    const handleUpdate = async (id) => {
      const endpoint = getOperationEndpoint();
        try {
            await API.put(`/${endpoint}/${id}`, formData);
            alert("Row updated!");
        
            setRows((prevRows) =>
              prevRows.map((row) => (row.id === id ? { ...row, ...formData } : row))
            );
            setFormData({});
          } catch (error) {
            console.error("Error updating row:", error);
          }
    };

    const handleDelete = async (id) => {
        const endpoint = getOperationEndpoint();
        const isConfirmed = window.confirm("Ar jūs isitikinę kad norite pašalinti šį įrašą?");
        if (isConfirmed) {
          try {
            await API.delete(`/${endpoint}/${id}`);
            alert("Row deleted!");
      
            // Update the rows state to reflect the deletion
            setRows((prevRows) => prevRows.filter((row) => row.id !== id));
          } catch (error) {
            console.error("Error deleting row:", error);
          }
        }
      };

    const getOperationEndpoint = () => {
      if (selectedTable && selectedTable.includes("posts")) {
          return "posts";
      }
      return `${selectedTable?.toLowerCase()}`;
    };

    return (
    <>
    <div className="flex bg-blue h-screen w-screen">
      <SideBar onTableSelect={setSelectedTable} />
      <div className="flex-1 p-5">
        {isLoading && <p className="text-lightest-blue text-center font-inter font-extrabold">Loading...</p>}

        {selectedTable && !isLoading && (
          <>
            <h1 className="mb-5 text-center font-inter font-extrabold text-2xl text-lightest-blue">{selectedTable}</h1>

            <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse bg-lightest-blue border-blue mb-5 border-2 rounded-lg">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="font-inter font-bold border-2 border-blue px-4 py-2">
                      {column}
                    </th>
                  ))}
                  <th className="font-inter font-bold border-blue border-2 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-lighter-blue  duration-150 transition-colors">
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="font-inter font-normal border-blue border-2 px-4 py-2"
                      >
                        {row[column]}
                      </td>
                    ))}
                    <td className="border-blue border-2 px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-0 mr-2"
                        onClick={() => setFormData(row)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 hover:invert">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>

                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1"
                        onClick={() => handleDelete(row.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 hover:invert">
                            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="grid grid-cols-2 gap-4"
            >
              {columns.map((column) => (
                <div key={column} className="mb-4">
                  <label className="font-inter font-bold text-lightest-blue block ">{column}</label>
                  <input
                    type="text"
                    value={formData[column] || ""}
                    onChange={(e) => handleInputChange(e, column)}
                    className="border bg-lightest-blue border-lightest-blue px-3 py-2 w-full"
                    disabled={column === "id"}
                  />
                </div>
              ))}
              <button
                type="submit"
                className="col-span-2 font-inter font-bold text-lightest-blue bg-blue border-lightest-blue border-2 rounded-md hover:bg-light-blue transition-colors duration-150 text-white px-5 py-2 mt-3 m-auto"
              >
                Save
              </button>
            </form>
          </>
        )}
      </div>
    </div>
    </>
    );
  };
  
  export default Dashboard;