import { useEffect, useState } from "react";
import API from "../API";
import { Label, Input, Field, Textarea, Select, Listbox, ListboxButton, ListboxOptions, ListboxOption} from '@headlessui/react';

export default function UniversityList(){
    const [universities, setUniversities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        API.get('/universities').then((response) => {
            console.log(response);
            setUniversities(response.data);
            setIsLoading(false);
        })
    }, [])

    return(
        <>

        <div className="flex flex-row gap-20 ml-10">
            <div className="sticky top-32 h-screen">
                <Field className="mb-4">
                    <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Raktažodis</Label>
                    <Input type="text" name="email" className="w-full bg-lightest-blue bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg"/>
                </Field>
                <Field className="mb-4">
                    <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Miestas</Label>
                    <Input type="text" name="email" className="w-full bg-lightest-blue bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg"/>
                </Field>
                <div className="flex gap-4 mt-8">
                    <button className="pl-4 pr-4 pt-1 pb-2 text-center bg-lightest-blue border-blue rounded-md border-2 border-slate-300 text-blue text-xl hover:bg-blue hover:text-lightest-blue duration-300 transition-colors"  
                        >Ieškoti
                    </button>
                </div>
            </div>
            {isLoading ? (
                <div class="w-8 h-8 border-4 rounded-full border-dotted border-t-lime-400 animate-spin m-auto mt-0">
                </div>
            ):(
                <div className="flex flex-col gap-20 w-3/5 pb-20">
                    {universities.map((value) => (
                        <div key={value.id} className="group border-2 w-full h-60 flex flex-row overflow-hidden relative shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-2xl hover:shadow-gray-500 ">
                            <div className="relative w-2/5">
                                <img
                                    className="border-r-2 absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    src={`../../public/assets/${value.picture}`}
                                    alt="University Logo"
                                    loading="lazy"
                                />
                            </div>
                            <div className="relative flex-grow flex flex-col justify-center items-center w-3/5 p-4">
                                <div 
                                    style={{ fontFamily: "Inter", fontWeight: 800, fontSize: "1.5em" }} 
                                    className="text-blue text-center"
                                >
                                    {value.name}
                                </div>
                                <div 
                                    className="absolute bottom-4 right-4 text-blue text-sm"
                                    style={{ fontFamily: "Inter" }}
                                >
                                    {value.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
        </div>
        </>
    )
}