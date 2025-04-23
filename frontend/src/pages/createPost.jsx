import { useState } from "react";
import { useStateContext } from "../context/contextProvider";
import API from "../utils/API";
import RichTextEditor from "../components/richTextEditor/RichTextEditor";

const categoryColors = {
    'Bendros diskusijos': { text: 'text-lght-blue', ring: 'ring-lght-blue', bg: 'bg-lght-blue'},
    'Kursų apžvalgos': { text: 'text-red', ring: 'ring-red', bg: 'bg-red' },
    'Socialinis gyvenimas ir renginiai': { text: 'text-orange', ring: 'ring-orange', bg: 'bg-orange' },
    'Studijų medžiagas': { text: 'text-green', ring: 'ring-green', bg: 'bg-green' },
    'Būstas ir apgyvendinimas': { text: 'text-purple', ring: 'ring-purple', bg: 'bg-purple' },
    'Praktikos ir karjeros galimybės': { text: 'text-lght-blue', ring: 'ring-lght-blue', bg: 'bg-lght-blue' },
    'Universiteto politika ir administracija': { text: 'text-red', ring: 'ring-red', bg: 'bg-red' },
};

const categories = [
    "Bendros diskusijos",
    "Kursų apžvalgos",
    "Socialinis gyvenimas ir renginiai",
    "Studijų medžiagas",
    "Būstas ir apgyvendinimas",
    "Praktikos ir karjeros galimybės",
    "Universiteto politika ir administracija",
]

const CreatePost = () => {
  const { user } = useStateContext();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    content: "",
    university: "none",
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content: content,
    });
  };
  
  const handleCategoryModal = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleApply = () => {
    setCategoriesOpen(false);
  };

  const handleCancel = () => {
    setSelectedCategories([]);
    setCategoriesOpen(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log("Form submitted with data:", formData);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <>
        <div className={`absolute w-full h-full shadow-xl p-6 bg-dark bg-opacity-85 z-20 items-center justify-center m-auto 
            ${
                categoriesOpen ? "block" : "hidden"
            }`}>
            <div className="w-4/5 bg-grey z-10 rounded-md ring-light-grey m-auto p-8 px-8 lg:w-2/5">
                <div className="flex flex-row justify-between mb-4">
                  <h1 className="text-lighter-blue font-bold text-2xl">Pridėti kategorijas</h1>
                  <div className="hidden md:block cursor-pointer hover:bg-light-grey p-1 rounded-lg transition duration-150 ease-linear" onClick={handleCategoryModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-lighter-blue">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="grid-rows-2 grid-cols-2">
                {categories.map((category, catIndex) => {
                        const { text, ring, bg } = categoryColors[category] || {
                        text: 'text-light-grey',
                        ring: 'ring-light-grey',
                        bg: 'bg-dark'
                        };

                        const isSelected = selectedCategories.includes(category);
                        
                        const textColor = isSelected ? 'text-white' : text;
                        const bgColor = isSelected ? bg : 'bg-transparent';

                        return (
                        <button
                            key={catIndex}
                            className={`w-full text-start ring-1 ${ring} ${textColor} ${bgColor} rounded-md p-1 px-2 mt-2`}
                            onClick={() => toggleCategory(category)}
                        >
                            {category}
                        </button>
                        );
                    })}
                </div>
                <div className="flex mt-5 mb-1 justify-end gap-3">
                    <button className="p-2 text-white ring-2 ring-white rounded-md hover:ring-lght-blue hover:text-lght-blue font-bold text-sm transition duration-150 ease-linear" onClick={handleCancel}>Atšaukti</button>
                    <button className="p-2 ring-2 rounded-md ring-lght-blue text-lght-blue font-bold text-sm transition duration-150 ease-linear" onClick={handleApply}>Pritaikyti</button>
                </div>
            </div>
        </div>
      <form onSubmit={handleSubmit} className="flex flex-col w-4/5 text-white justify-center m-auto gap-5">
        <h1 className="font-bold text-2xl">Sukurkite įrašą</h1>
        
        <input
          className="rounded-md bg-grey p-2"
          placeholder="Tema"
          name="topic"
          value={formData.topic}
          onChange={handleInputChange}
        />
        
        <button
          type="button"
          className="rounded-md ring-1 ring-white w-6/12 py-1 text-white mt-5 text-sm hover:ring-lght-blue hover:text-lght-blue lg:w-1/5 transition duration-150 ease-linear"
          onClick={handleCategoryModal}
        >
          Pridėti kategorijas
        </button>
        
        {/* Show selected categories */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategories.map((category, index) => {
              const { text, ring } = categoryColors[category] || {
                text: 'text-light-grey',
                bg: 'bg-dark',
                ring: 'ring-light-grey'
              };
              
              return (
                <div key={index} className={`${ring} ${text} ring-1 px-2 py-1 rounded-md text-sm`}>
                  {category}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Using the RichTextEditor component */}
        <RichTextEditor 
          value={formData.content}
          onChange={handleContentChange}
          placeholder="Tekstas"
        />
        
        <select
          className="bg-grey text-white p-3 rounded-md"
          name="university"
          value={formData.university}
          onChange={handleInputChange}
        >
          <option value="none">Pasirinkite universiteta...</option>
          <option value="KTU">Kauno Technologijos universitetas</option>
          <option value="VDU">Vytauto Didžiojo universitetas</option>
          <option value="KTU3">Kauno Technologijos universitetas</option>
          <option value="KTU4">Kauno Technologijos universitetas</option>
        </select>

        <select
          className="bg-grey text-white p-3 rounded-md hidden"
          name="university"
          value={formData.university}
          onChange={handleInputChange}
        >
          <option value="none">Pasirinkite programą... (Neprivaloma)</option>
          <option value="KTU">Kauno Technologijos universitetas</option>
          <option value="VDU">Vytauto Didžiojo universitetas</option>
          <option value="KTU3">Kauno Technologijos universitetas</option>
          <option value="KTU4">Kauno Technologijos universitetas</option>
        </select>

        <select
          className="bg-grey text-white p-3 rounded-md hidden"
          name="university"
          value={formData.university}
          onChange={handleInputChange}
        >
          <option value="none">Pasirinkite kursą... (Neprivaloma)</option>
          <option value="KTU">Kauno Technologijos universitetas</option>
          <option value="VDU">Vytauto Didžiojo universitetas</option>
          <option value="KTU3">Kauno Technologijos universitetas</option>
          <option value="KTU4">Kauno Technologijos universitetas</option>
        </select>
        
        <button
          type="submit"
          className="w-4/12 p-2 rounded-md ring-2 mt-10 ring-white text-white font-medium text-lg hover:ring-lght-blue hover:text-lght-blue lg:w-1/5 transition duration-150 ease-linear"
        >
          Įkelti
        </button>
      </form>
    </>
  );
};

export default CreatePost;